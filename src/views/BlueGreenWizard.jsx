import React, { Component } from 'react';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';

import { Container, Row, Col, ButtonToolbar } from 'react-bootstrap';

import HelmVariables from 'components/Deployment/HelmVariables.jsx';
import TrafficPanel from 'components/Traffic/TrafficPanel.jsx';
import { multipleInstall, retrieveSettings } from 'client-api/apicall.jsx';

// eslint-disable-next-line
const NAMESPACE = '${NAMESPACE}';

class Step1 extends React.Component {
  updateProps() {
    let state = this.getInnerState();
    if (state !== undefined) {
      this.props.updateHost(state.hosts['istio.virtualservices.hosts[0]']);
      this.props.updateApiPath(state.defaultApiPath);
      let onlyChartName = '';
      if (state.chartName.indexOf('/') > -1) {
        onlyChartName = state.chartName.substring(
          state.chartName.indexOf('/') + 1
        );
      } else {
        onlyChartName = state.chartName;
      }

      let serviceName = onlyChartName + '-' + this.props.envName;
      this.props.updateServiceName(serviceName);
      let defaultReleaseName =
        state.releaseName.substring(0, state.releaseName.indexOf('-beta')) +
        '-' +
        NAMESPACE;
      let headerReleaseName = state.releaseName + '-' + NAMESPACE;
      this.props.updateDefaultReleaseName(defaultReleaseName);
      this.props.updateHeaderReleaseName(headerReleaseName);
      this.props.saveState(state);
    }
  }

  showConfirmCopyModal() {}

  getInnerState() {
    let result = undefined;
    if (this.refs['h1'] !== undefined) {
      result = this.refs['h1'].state;
    }
    return result;
  }

  async componentDidMount() {
    await this.refs['h1'].getVariables(
      this.props.chartName,
      this.props.chartVersion
    );

    let data = [];
    data.push('commonValuesConfigMapChart');
    data.push('commonVariablesConfigMapChart');
    data.push('canaryChart');

    retrieveSettings({ list: data }, this, result => {
      let vCommonValuesConfigMapChart = '';
      let vCommonVariablesConfigMapChart = '';
      let vCanaryChart = '';

      for (let x = 0; x < result.List.length; x++) {
        let field = result.List[x].name;
        let value = result.List[x].value;

        if (field === 'commonValuesConfigMapChart') {
          vCommonValuesConfigMapChart = value;
        } else {
          if (field === 'commonVariablesConfigMapChart') {
            vCommonVariablesConfigMapChart = value;
          } else {
            if (field === 'canaryChart') {
              vCanaryChart = value;
            }
          }
        }
      }

      this.setState({
        vCommonValuesConfigMapChart: vCommonValuesConfigMapChart,
        vCommonVariablesConfigMapChart: vCommonVariablesConfigMapChart,
        vCanaryChart: vCanaryChart
      });
    });
  }

  saveVariablesAndDeploy() {
    let payload = { deployables: [] };
    this.refs['h1'].save(list => {
      for (let x = 0; x < list.length; x++) {
        let data = list[x];
        payload.deployables.push(data);
        payload.environmentId = this.props.envId;
      }
      multipleInstall(payload, this);
    });
  }

  render() {
    if (this.props.currentStep !== 1) {
      // Prop: The current step
      return null;
    }
    return (
      <div>
        <HelmVariables
          vCommonValuesConfigMapChart={this.state.vCommonValuesConfigMapChart}
          vCommonVariablesConfigMapChart={
            this.state.vCommonVariablesConfigMapChart
          }
          vCanaryChart={this.state.vCanaryChart}
          handleLoading={this.props.handleLoading}
          canary={true}
          copyVariables={this.showConfirmCopyModal.bind(this)}
          handleNotification={this.props.handleNotification}
          key="h1"
          chartName={this.props.chartName}
          chartVersion={this.props.chartVersion}
          xref="h1"
          ref="h1"
          envId={this.props.envId}
        />
      </div>
    );
  }
}

class Step2 extends React.Component {
  render() {
    if (this.props.currentStep !== 2) {
      // Prop: The current step
      return null;
    }
    return (
      <div>
        <TrafficPanel
          ref="trafficPanel"
          host={this.props.host}
          apiPath={this.props.apiPath}
          serviceName={this.props.serviceName}
          defaultReleaseName={this.props.defaultReleaseName}
          headerReleaseName={this.props.headerReleaseName}
          selectedEnvironment={this.props.selectedEnvironment}
          handleLoading={this.props.handleLoading}
          handleNotification={this.props.handleNotification}
        />
      </div>
    );
  }

  applyByHeader() {
    if (this.refs['trafficPanel'] !== undefined) {
      this.refs['trafficPanel'].applyByHeader();
    }
  }

  applyByWeight() {
    if (this.refs['trafficPanel'] !== undefined) {
      this.refs['trafficPanel'].applyByWeight();
    }
  }
}

class BlueGreenWizard extends Component {
  state = {
    currentStep: 1,
    chartName: '',
    chartVersion: '',
    host: '',
    apiPath: '',
    serviceName: '',
    defaultReleaseName: '',
    headerReleaseName: '',
    releaseState: {}
  };

  constructor(props) {
    super(props);

    this.state.envId = this.props.selectedEnvironment.value;
    this.state.envName = NAMESPACE;

    console.log('Env: ' + this.props.selectedEnvironment.value);

    let charts = this.props.selectedChartsToDeploy;
    if (charts !== undefined && charts.length > 0) {
      let firstElement = charts[0];
      let chartName = firstElement.substring(0, firstElement.indexOf('@'));
      let chartVersion = firstElement.substring(
        firstElement.indexOf('@') + 1,
        firstElement.length
      );

      this.state.chartName = chartName;
      this.state.chartVersion = chartVersion;
    }
  }

  finishWithBlueGreen() {
    if (this.refs['step2'] !== undefined) {
      this.refs['step2'].applyByWeight();
    }

    this.props.history.push({
      pathname: '/admin/workload'
    });
  }

  finishWithCanary() {
    if (this.refs['step2'] !== undefined) {
      this.refs['step2'].applyByHeader();
    }

    this.props.history.push({
      pathname: '/admin/workload'
    });
  }

  async next() {
    if (this.refs['step1'] !== undefined) {
      await this.refs['step1'].updateProps();
      await this.refs['step1'].saveVariablesAndDeploy();
    }

    let currentStep = this.state.currentStep;
    currentStep = currentStep >= 2 ? 3 : currentStep + 1;

    this.setState({
      currentStep: currentStep
    });
  }

  prev() {
    let currentStep = this.state.currentStep;
    currentStep = currentStep <= 1 ? 1 : currentStep - 1;
    this.setState({
      currentStep: currentStep
    });
  }

  get previousButton() {
    let currentStep = this.state.currentStep;

    return (
      <button
        disabled={currentStep <= 1}
        className="btn btn-secondary pull-right"
        type="button"
        onClick={this.prev.bind(this)}
      >
        Previous
      </button>
    );
  }

  get nextButton() {
    let currentStep = this.state.currentStep;
    if (currentStep < 2) {
      return (
        <button
          className="btn btn-primary pull-right"
          type="button"
          onClick={this.next.bind(this)}
        >
          Deploy it and Next Steps
        </button>
      );
    }
    return (
      <div>
        <button
          className="btn btn-primary pull-right"
          type="button"
          onClick={this.finishWithCanary.bind(this)}
        >
          Finish with Canary
        </button>

        <button
          className="btn btn-primary pull-right"
          type="button"
          onClick={this.finishWithBlueGreen.bind(this)}
        >
          Finish with Blue/Green
        </button>
      </div>
    );
  }

  updateHost(host) {
    this.setState({ host: host });
  }

  updateApiPath(apiPath) {
    this.setState({ apiPath: apiPath });
  }

  updateServiceName(serviceName) {
    this.setState({ serviceName: serviceName });
  }

  updateDefaultReleaseName(defaultReleaseName) {
    this.setState({ defaultReleaseName: defaultReleaseName });
  }

  updateHeaderReleaseName(headerReleaseName) {
    this.setState({ headerReleaseName: headerReleaseName });
  }

  saveState(releaseState) {
    this.setState({ releaseState: releaseState });
  }

  render() {
    let firstClassName =
      this.state.currentStep === 1
        ? 'btn btn-success btn-circle btn-fill'
        : 'btn btn-default btn-circle';
    let secondClassName =
      this.state.currentStep === 2
        ? 'btn btn-success btn-circle btn-fill'
        : 'btn btn-default btn-circle';

    return (
      <div className="content">
        <Container fluid>
          <Row>
            <Col md={12}>
              <CardTenkai
                title=""
                content={
                  <div>
                    <div className="stepwizard">
                      <div className="setup-panel">
                        <div className="col-xs-3">
                          <a
                            href="#step-1"
                            type="button"
                            className={firstClassName}
                            disabled={this.state.currentStep !== 1}
                          >
                            1
                          </a>
                          <p>
                            <small>Configure a new version of service</small>
                          </p>
                        </div>
                        <div className="col-xs-3">
                          <a
                            href="#step-2"
                            type="button"
                            className={secondClassName}
                            disabled={this.state.currentStep !== 2}
                          >
                            2
                          </a>
                          <p>
                            <small>Configure traffic rules</small>
                          </p>
                        </div>
                      </div>
                    </div>

                    <ButtonToolbar>
                      {this.nextButton}
                      {this.previousButton}
                    </ButtonToolbar>
                  </div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <CardTenkai
                title=""
                content={
                  <div>
                    <Step1
                      ref="step1"
                      currentStep={this.state.currentStep}
                      chartName={this.state.chartName}
                      chartVersion={this.state.chartVersion}
                      envId={this.state.envId}
                      handleLoading={this.props.handleLoading}
                      handleNotification={this.props.handleNotification}
                      updateHost={this.updateHost.bind(this)}
                      updateApiPath={this.updateApiPath.bind(this)}
                      updateServiceName={this.updateServiceName.bind(this)}
                      updateDefaultReleaseName={this.updateDefaultReleaseName.bind(
                        this
                      )}
                      updateHeaderReleaseName={this.updateHeaderReleaseName.bind(
                        this
                      )}
                      saveState={this.saveState.bind(this)}
                      envName={this.state.envName}
                    ></Step1>

                    <Step2
                      ref="step2"
                      currentStep={this.state.currentStep}
                      host={this.state.host}
                      apiPath={this.state.apiPath}
                      serviceName={this.state.serviceName}
                      defaultReleaseName={this.state.defaultReleaseName}
                      headerReleaseName={this.state.headerReleaseName}
                      selectedEnvironment={this.props.selectedEnvironment}
                      handleLoading={this.props.handleLoading}
                      handleNotification={this.props.handleNotification}
                    ></Step2>
                  </div>
                }
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default BlueGreenWizard;
