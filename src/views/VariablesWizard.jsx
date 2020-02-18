import React, { Component } from 'react';
import { Container, Row, Col, ButtonToolbar } from 'react-bootstrap';

import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import Button from 'components/CustomButton/CustomButton.jsx';
import HelmVariables from 'components/Deployment/HelmVariables.jsx';
import CopyModal from 'components/Modal/CopyModal.jsx';
import { multipleInstall, getHelmCommand } from 'client-api/apicall.jsx';
import HelmCommandModal from 'components/Modal/HelmCommandModal.jsx';
import queryString from 'query-string';
import { validateVariables } from 'client-api/apicall.jsx';
import SimpleModal from 'components/Modal/SimpleModal.jsx';
import { ACTION_SAVE_VARIABLES, ACTION_DEPLOY } from 'policies.js';
import { getAllEnvironments, retrieveSettings } from 'client-api/apicall.jsx';

class VariablesWizard extends Component {
  state = {
    envId: '',
    charts: [],
    chartVersions: new Map(),
    onShowCopyModal: false,
    desiredTags: new Map(),
    showEditorModal: false,
    helmValue: '',
    showConfirmInstallModal: false,
    installPayload: [],
    invalidVariables: {},
    chartsValidated: 0,
    envsToCopy: []
  };

  componentDidMount() {
    this.props.handleLoading(true);
    let total = this.props.selectedChartsToDeploy.length;
    let chartsToDeploy = this.props.selectedChartsToDeploy;
    let helmCharts = [];
    let chartVersion = '';
    let value = '';
    let chartVersions = new Map();
    let desiredTags = new Map();
    for (let i = 0; i < total; i++) {
      value = chartsToDeploy[i].substring(0, chartsToDeploy[i].indexOf('@'));
      helmCharts.push(value);

      if (chartsToDeploy[i].indexOf('#') > 0) {
        let dockerImage = chartsToDeploy[i].substring(
          chartsToDeploy[i].indexOf('#') + 1,
          chartsToDeploy[i].length
        );
        desiredTags[value] = dockerImage;

        chartVersion = chartsToDeploy[i].substring(
          chartsToDeploy[i].indexOf('@') + 1,
          chartsToDeploy[i].indexOf('#')
        );
        chartVersions[value] = chartVersion;
      } else {
        chartVersion = chartsToDeploy[i].substring(
          chartsToDeploy[i].indexOf('@') + 1,
          chartsToDeploy[i].length
        );
        chartVersions[value] = chartVersion;
      }
    }

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

    this.setState(
      {
        charts: helmCharts,
        chartVersions: chartVersions,
        desiredTags: desiredTags
      },
      async () => this.didMountCallback(helmCharts)
    );
  }

  didMountCallback = async helmCharts => {
    await this.getChildVariables();
    this.props.handleLoading(false);
    this.validateVars(helmCharts, this.callbackValidate);
  };

  async getChildVariables() {
    for (let x = 0; x < this.state.charts.length; x++) {
      let chartName = this.state.charts[x];
      await this.refs['h' + x].getVariables(
        chartName,
        this.state.chartVersions[chartName]
      );
    }
  }

  constructor(props) {
    super(props);
    this.state.envId = this.props.selectedEnvironment.value;
    const values = queryString.parse(props.location.search);
    this.state.productVersionId = values.productVersionId;
  }

  onSaveVariablesClick = () => {
    this.setState({ invalidVariables: {}, chartsValidated: 0 }, () => {
      this.props.handleLoading(true);
      let count = this.state.charts.length;
      let index = 0;

      this.state.charts.forEach((item, key) => {
        this.refs['h' + key].save(data => {
          index++;
          if (index >= count) {
            this.props.handleNotification(
              'custom',
              'success',
              'Variables saved!'
            );
            this.props.handleLoading(false);
            this.validateVars([item], this.callbackValidate);
          }
        }, this.validateVars);
      });
    });
  };

  onHelmCommand = () => {
    let payload = { deployables: [] };
    let count = 0;
    const totalCharts = this.state.charts.length;

    this.state.charts.forEach((item, key) => {
      this.refs['h' + key].save(list => {
        for (let x = 0; x < list.length; x++) {
          let data = list[x];
          payload.deployables.push(data);
        }
        count++;
        if (count === totalCharts) {
          this.onSaveHelmCommand(payload);
        }
      });
    });
  };

  install = () => {
    let onlyInstall = !this.props.hasEnvironmentPolicy(ACTION_SAVE_VARIABLES);
    if (onlyInstall) {
      this.onlySaveTagAndInstall();
    } else {
      this.installUpdate();
    }
  };

  onlySaveTagAndInstall = () => {
    let payload = {
      productVersionId: parseInt(this.state.productVersionId),
      environmentId: parseInt(this.state.envId),
      deployables: []
    };
    let count = 0;
    const totalCharts = this.state.charts.length;

    this.state.charts.forEach((item, key) => {
      this.refs['h' + key].saveTag(list => {
        for (let x = 0; x < list.length; x++) {
          let data = list[x];
          payload.deployables.push(data);
        }
        count++;
        if (count === totalCharts) {
          this.setState({ installPayload: payload }, () => {
            multipleInstall(payload, this);
          });
        }
      });
    });
  };

  installUpdate = () => {
    this.setState({ invalidVariables: {}, chartsValidated: 0 }, () => {
      let payload = {
        productVersionId: parseInt(this.state.productVersionId),
        environmentId: parseInt(this.state.envId),
        deployables: []
      };

      let count = 0;
      const totalCharts = this.state.charts.length;

      this.state.charts.forEach((item, key) => {
        this.refs['h' + key].save(list => {
          for (let x = 0; x < list.length; x++) {
            let data = list[x];
            payload.deployables.push(data);
          }
          count++;
          if (count === totalCharts) {
            this.setState({ installPayload: payload }, () => {
              this.validateVars(
                this.state.charts,
                this.callbackValidateAndInstall,
                this.refs['h' + key]
              );
            });
          }
        });
      });
    });
  };

  validateVars(helmCharts, callback, cmRef) {
    helmCharts.forEach(async chart => {
      await validateVariables(
        this,
        parseInt(this.props.selectedEnvironment.value),
        chart,
        callback,
        cmRef
      );
    });
  }

  callbackValidate = invalidVars => {
    const invalidToMap = this.arrayToMap(invalidVars);

    this.setState({
      invalidVariables: {
        ...this.state.invalidVariables,
        ...invalidToMap
      },
      chartsValidated: this.state.chartsValidated + 1
    });
  };

  hasInvalidVarsInConfigMap(cmRef) {
    return (
      !!cmRef &&
      !!cmRef.refs &&
      !!cmRef.refs.hConfigMap &&
      Object.entries(cmRef.refs.hConfigMap.state.invalidVariables).length > 0
    );
  }

  callbackValidateAndInstall = (invalidVars, cmRef) => {
    this.callbackValidate(invalidVars);

    if (this.state.chartsValidated === this.state.charts.length) {
      if (this.hasInvalidVarsInConfigMap(cmRef) || invalidVars.length > 0) {
        this.setState({ showConfirmInstallModal: true });
      } else {
        multipleInstall(this.state.installPayload, this);
      }
    }
  };

  arrayToMap(invalidVariables) {
    const invalidToMap = {};
    invalidVariables.forEach(val => {
      if (!!invalidToMap[val.name]) {
        invalidToMap[val.name].push(val);
      } else {
        invalidToMap[val.name] = [];
        invalidToMap[val.name].push(val);
      }
    });
    return invalidToMap;
  }

  onCloseCopyModal() {
    this.setState({ onShowCopyModal: false, chartToManipulate: '' });
  }

  async onConfirmCopyModal(item) {
    await this.refs[this.state.chartToManipulate].listVariables(item.value);
    this.setState({ onShowCopyModal: false, chartToManipulate: '' });
  }

  showConfirmCopyModal(ref) {
    getAllEnvironments(this, (envs, error) => {
      if (error) {
        this.props.handleNotification('custom', 'error', error.message);
      } else {
        let options = [];
        for (let x = 0; x < envs.length; x++) {
          options.push({ label: envs[x].name, value: envs[x].ID });
        }
        this.setState({ envsToCopy: options }, () => {
          this.setState({ onShowCopyModal: true, chartToManipulate: ref });
        });
      }
    });
  }

  closeEditorModal() {
    this.setState({ showEditorModal: false, yaml: '' });
  }

  onSaveHelmCommand = payload => {
    getHelmCommand(payload, this, res => {
      this.setState({ helmValue: res.data, showEditorModal: true });
    });
  };

  handleConfirmInstallClose = () => {
    this.setState({ showConfirmInstallModal: false });
  };

  handleConfirmInstall = () => {
    multipleInstall(this.state.installPayload, this);
    this.setState({ installPayload: [], showConfirmInstallModal: false });
  };

  render() {
    const envId = this.state.envId;
    const items = this.state.charts.map((item, key) => {
      return (
        <HelmVariables
          vCommonValuesConfigMapChart={this.state.vCommonValuesConfigMapChart}
          vCommonVariablesConfigMapChart={
            this.state.vCommonVariablesConfigMapChart
          }
          vCanaryChart={this.state.vCanaryChart}
          handleLoading={this.props.handleLoading}
          hasEnvironmentPolicy={this.props.hasEnvironmentPolicy.bind(this)}
          canary={false}
          copyVariables={this.showConfirmCopyModal.bind(this)}
          handleNotification={this.props.handleNotification}
          key={key}
          chartName={item}
          chartVersion={this.state.chartVersions[item]}
          desiredTag={this.state.desiredTags[item]}
          xref={'h' + key}
          ref={'h' + key}
          envId={envId}
          invalidVariables={this.state.invalidVariables}
        />
      );
    });

    return (
      <div className="content">
        <HelmCommandModal
          value={this.state.helmValue}
          show={this.state.showEditorModal}
          close={this.closeEditorModal.bind(this)}
        />

        <CopyModal
          onShow={this.state.onShowCopyModal}
          onClose={this.onCloseCopyModal.bind(this)}
          title="Copy config from another environment"
          subTitle="Select environment"
          onConfirm={this.onConfirmCopyModal.bind(this)}
          environments={this.state.envsToCopy}
        ></CopyModal>

        <SimpleModal
          showConfirmDeleteModal={this.state.showConfirmInstallModal}
          handleConfirmDeleteModalClose={this.handleConfirmInstallClose.bind(
            this
          )}
          title="Invalid variables detected!"
          subTitle="Install anyway?"
          message="There are variables with invalid values. Please, review and then install it again."
          handleConfirmDelete={this.handleConfirmInstall.bind(this)}
        />

        <Container fluid>
          <Row>
            <Col md={12}>
              <CardTenkai
                title=""
                content={
                  <div align="right">
                    <ButtonToolbar style={{ display: 'block' }}>
                      <Button
                        className="btn-primary pull-right"
                        type="button"
                        onClick={this.onHelmCommand}
                      >
                        Show Helm Command
                      </Button>

                      <Button
                        className="btn-info pull-right"
                        type="button"
                        onClick={this.onSaveVariablesClick}
                        disabled={
                          !this.props.hasEnvironmentPolicy(
                            ACTION_SAVE_VARIABLES
                          )
                        }
                      >
                        Save Variables
                      </Button>

                      <Button
                        className="btn-primary pull-right"
                        type="button"
                        onClick={this.install}
                        disabled={
                          !this.props.hasEnvironmentPolicy(ACTION_DEPLOY)
                        }
                      >
                        Install/Update
                      </Button>
                    </ButtonToolbar>
                  </div>
                }
              />
            </Col>
          </Row>

          {items}
        </Container>
      </div>
    );
  }
}

export default VariablesWizard;
