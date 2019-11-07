import React, { Component } from 'react';
import {
  Tabs,
  Tab,
  PanelGroup,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  ButtonToolbar
} from 'react-bootstrap';
import { Card } from 'components/Card/Card.jsx';
import {
  listHelmDeploymentsByEnvironment,
  listPods,
  listServices,
  promote,
  listEndpoints
} from 'client-api/apicall.jsx';
import { ReleasePanel } from 'components/Workload/ReleasePanel.jsx';
import { PodPanel } from 'components/Workload/PodPanel.jsx';
import { ServicePanel } from 'components/Workload/ServicePanel.jsx';
import { EndpointPanel } from 'components/Workload/EndpointPanel.jsx';
import Button from 'components/CustomButton/CustomButton.jsx';
import CopyModal from 'components/Modal/CopyModal.jsx';
import EditModal from 'components/Modal/EditModal';

class Workload extends Component {
  state = {
    list: [],
    inputFilter: '',
    podInputFilter: '',
    serviceInputFilter: '',
    endpointInputFilter: '',
    podList: [],
    serviceList: [],
    endpointList: [],
    onShowCopyModal: false,
    mode: 'workload',
    onShowConfirmModal: false,
    targetEnvToPromote: {},
    confirmInput: ''
  };

  navigateToBlueGreenWizard(item) {
    let chartsToDeploy = [];
    let chartName = item.Chart;
    let chartVersion = item.Chart;
    chartName = chartName.substring(0, chartName.lastIndexOf('-'));
    chartVersion = chartVersion.substring(chartVersion.lastIndexOf('-') + 1);
    chartsToDeploy.push(chartName + '@' + chartVersion);
    this.props.updateSelectedChartsToDeploy(chartsToDeploy);

    this.props.history.push({
      pathname: '/admin/blueGreenWizard'
    });
  }

  componentDidMount() {
    this.listDeploymentsByEnv();
    this.listPods();
    this.listServices();
    this.listEndpoints();
  }

  refreshPods() {
    this.listPods();
  }

  refreshServices() {
    this.listServices();
  }

  refreshEndpoints() {
    this.listEndpoints();
  }

  refreshReleases() {
    this.listDeploymentsByEnv();
  }

  onCloseCopyModal() {
    this.setState({ onShowCopyModal: false });
  }

  async onConfirmCopyModal(item) {
    if (this.state.mode === 'full') {
      this.setState({
        onShowCopyModal: false,
        onShowConfirmModal: true,
        targetEnvToPromote: item
      });
    } else {
      this.setState({ targetEnvToPromote: item }, () => {
        promote(
          this,
          this.props.selectedEnvironment.value,
          this.state.targetEnvToPromote.value,
          false
        );
        this.setState({
          onShowCopyModal: false,
          onShowConfirmModal: false,
          targetEnvToPromote: {}
        });
      });
    }
  }

  async doPromote() {
    if (this.state.confirmInput === this.state.targetEnvToPromote.label) {
      promote(
        this,
        this.props.selectedEnvironment.value,
        this.state.targetEnvToPromote.value,
        true
      );
      this.setState({ onShowConfirmModal: false, targetEnvToPromote: {} });
    }
  }

  showConfirmCopyModal(ref) {
    this.setState({ mode: 'workload', onShowCopyModal: true });
  }

  showConfirmCopyModalFull(ref) {
    this.setState({ mode: 'full', onShowCopyModal: true });
  }

  listEndpoints() {
    listEndpoints(this, this.props.selectedEnvironment.value, function(
      self,
      res
    ) {
      if (res !== undefined && res.data !== null) {
        self.setState({ endpointList: res.data });
      } else {
        self.setState({ endpointList: [] });
      }
    });
  }

  listPods() {
    listPods(this, this.props.selectedEnvironment.value, function(self, res) {
      if (res !== undefined && res.data !== null) {
        self.setState({ podList: res.data.pods });
      } else {
        self.setState({ podList: [] });
      }
    });
  }

  listServices() {
    listServices(this, this.props.selectedEnvironment.value, function(
      self,
      res
    ) {
      if (res !== undefined && res.data !== null) {
        self.setState({ serviceList: res.data.services });
      } else {
        self.setState({ serviceList: [] });
      }
    });
  }

  listDeploymentsByEnv() {
    listHelmDeploymentsByEnvironment(
      this,
      this.props.selectedEnvironment.value,
      function(self, res) {
        if (res !== undefined && res.data !== null) {
          self.setState({ list: res.data.Releases });
        } else {
          self.setState({ list: [] });
        }
      }
    );
  }

  onTabSelect(tabName) {}

  onChangeInputHandler(e) {
    this.setState({
      inputFilter: e.target.value
    });
  }

  onChangePodInputHandler(e) {
    this.setState({
      podInputFilter: e.target.value
    });
  }

  onChangeServiceInputHandler(e) {
    this.setState({
      serviceInputFilter: e.target.value
    });
  }

  onChangeEndpointInputHandler(e) {
    this.setState({
      endpointInputFilter: e.target.value
    });
  }

  onCloseConfirmModal() {
    this.setState({ onShowConfirmModal: false, targetEnvToPromote: {} });
  }

  handleConfirmInputChange(e) {
    let value = e.target.value;
    this.setState({ confirmInput: value });
  }

  render() {
    const items = this.state.list
      .filter(
        d =>
          this.state.inputFilter === '' ||
          d.Name.includes(this.state.inputFilter)
      )
      .map((item, key) => (
        <ReleasePanel
          eventKey={key}
          keycloak={this.props.keycloak}
          key={key}
          item={item}
          selectedEnvironment={this.props.selectedEnvironment}
          handleLoading={this.props.handleLoading}
          handleNotification={this.props.handleNotification}
          historyList={this.state.historyList}
          onTabSelect={this.onTabSelect.bind(this)}
          navigateToBlueGreenWizard={this.navigateToBlueGreenWizard.bind(
            this,
            item
          )}
          refresh={this.listDeploymentsByEnv.bind(this)}
        />
      ));

    return (
      <Tabs
        defaultActiveKey="pods"
        id="workload-tab"
        onSelect={this.onTabSelect.bind(this)}
      >
        <Tab eventKey="pods" title="Pods">
          <Card
            title=""
            content={
              <div>
                <Row>
                  <Col xs={4}>
                    <FormGroup>
                      <ControlLabel>Pod Search</ControlLabel>
                      <FormControl
                        value={this.state.podInputFilter}
                        onChange={this.onChangePodInputHandler.bind(this)}
                        style={{ width: '100%' }}
                        type="text"
                        aria-label="Search"
                      ></FormControl>
                    </FormGroup>
                  </Col>

                  <Col xs={8}>
                    <Button
                      className="btn btn-info pull-right"
                      bsSize="sm"
                      onClick={this.refreshPods.bind(this)}
                    >
                      <i className="pe-7s-refresh-2" /> Refresh
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <PodPanel
                      selectedEnvironment={this.props.selectedEnvironment}
                      handleLoading={this.props.handleLoading}
                      handleNotification={this.props.handleNotification}
                      list={this.state.podList.filter(
                        d =>
                          this.state.podInputFilter === '' ||
                          d.name.includes(this.state.podInputFilter)
                      )}
                    />
                  </Col>
                </Row>
              </div>
            }
          />
        </Tab>
        <Tab eventKey="services" title="Services">
          <Card
            title=""
            content={
              <div>
                <Row>
                  <Col xs={4}>
                    <FormGroup>
                      <ControlLabel>Service Search</ControlLabel>
                      <FormControl
                        value={this.state.serviceInputFilter}
                        onChange={this.onChangeServiceInputHandler.bind(this)}
                        style={{ width: '100%' }}
                        type="text"
                        aria-label="Search"
                      ></FormControl>
                    </FormGroup>
                  </Col>

                  <Col xs={8}>
                    <Button
                      className="btn btn-info pull-right"
                      bsSize="sm"
                      onClick={this.refreshServices.bind(this)}
                    >
                      <i className="pe-7s-refresh-2" /> Refresh
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <ServicePanel
                      selectedEnvironment={this.props.selectedEnvironment}
                      handleLoading={this.props.handleLoading}
                      handleNotification={this.props.handleNotification}
                      list={this.state.serviceList.filter(
                        d =>
                          this.state.serviceInputFilter === '' ||
                          d.name.includes(this.state.serviceInputFilter)
                      )}
                    />
                  </Col>
                </Row>
              </div>
            }
          />
        </Tab>

        <Tab eventKey="ep" title="Public Endpoints">
          <Card
            title=""
            content={
              <div>
                <Row>
                  <Col xs={4}>
                    <FormGroup>
                      <ControlLabel>Public endpoint search</ControlLabel>
                      <FormControl
                        value={this.state.endpointInputFilter}
                        onChange={this.onChangeEndpointInputHandler.bind(this)}
                        style={{ width: '100%' }}
                        type="text"
                        aria-label="Search"
                      ></FormControl>
                    </FormGroup>
                  </Col>

                  <Col xs={8}>
                    <Button
                      className="btn btn-info pull-right"
                      bsSize="sm"
                      onClick={this.refreshEndpoints.bind(this)}
                    >
                      <i className="pe-7s-refresh-2" /> Refresh
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <EndpointPanel
                      list={this.state.endpointList.filter(
                        d =>
                          this.state.endpointInputFilter === '' ||
                          d.includes(this.state.endpointInputFilter)
                      )}
                    />
                  </Col>
                </Row>
              </div>
            }
          />
        </Tab>

        <Tab eventKey="helm" title="Helm Releases">
          <Card
            title=""
            content={
              <div>
                <CopyModal
                  onShow={this.state.onShowCopyModal}
                  onClose={this.onCloseCopyModal.bind(this)}
                  title="Select target environment"
                  onConfirm={this.onConfirmCopyModal.bind(this)}
                  environments={this.props.environments}
                  onlyMyEnvironments={true}
                ></CopyModal>

                <EditModal
                  title="Confirm"
                  header={true}
                  onShow={this.state.onShowConfirmModal}
                  onClose={this.onCloseConfirmModal.bind(this)}
                  form={
                    <div>
                      <p>
                        This is a <b>dangerous</b> operation, target environment{' '}
                        <b> {this.state.targetEnvToPromote.label} </b> within
                        all variables will be destroyed!
                      </p>
                      <p>
                        Please, enter the target environment name to confirm!
                      </p>
                      <input
                        text
                        name="confirmInput"
                        value={this.state.confirmInput}
                        onChange={this.handleConfirmInputChange.bind(this)}
                      />
                      <hr />
                      <ButtonToolbar>
                        <Button
                          className="btn btn-danger btn-fill"
                          bsSize="sm"
                          disabled={
                            this.state.confirmInput !==
                            this.state.targetEnvToPromote.label
                          }
                          onClick={this.doPromote.bind(this)}
                        >
                          <i className="pe-7s-smile" /> Confirm
                        </Button>
                        <Button
                          className="btn btn-info btn-fill"
                          bsSize="sm"
                          onClick={this.onCloseConfirmModal.bind(this)}
                        >
                          <i className="pe-7s-smile" /> Cancel
                        </Button>
                      </ButtonToolbar>
                    </div>
                  }
                />

                <Row>
                  <Col xs={4}>
                    <FormGroup>
                      <ControlLabel>Release Search</ControlLabel>
                      <FormControl
                        value={this.state.inputFilter}
                        onChange={this.onChangeInputHandler.bind(this)}
                        style={{ width: '100%' }}
                        type="text"
                        aria-label="Search"
                      ></FormControl>
                    </FormGroup>
                  </Col>

                  <Col xs={2}>
                    <Button
                      className="btn btn-info pull-right"
                      bsSize="sm"
                      onClick={this.refreshReleases.bind(this)}
                    >
                      <i className="pe-7s-refresh-2" /> Refresh
                    </Button>
                  </Col>

                  <Col xs={6}>
                    <ButtonToolbar>
                      <Button
                        className="btn btn-success btn-fill pull-right"
                        bsSize="sm"
                        onClick={this.showConfirmCopyModal.bind(this)}
                        disabled={
                          !this.props.keycloak.hasRealmRole('tenkai-admin')
                        }
                      >
                        <i className="pe-7s-smile" /> Copy Releases to another
                        namespace
                      </Button>

                      <Button
                        className="btn btn-danger btn-fill pull-right"
                        bsSize="sm"
                        onClick={this.showConfirmCopyModalFull.bind(this)}
                        disabled={
                          !this.props.keycloak.hasRealmRole('tenkai-admin')
                        }
                      >
                        <i className="pe-7s-smile" /> Replicate full environment
                      </Button>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <PanelGroup accordion id="workload-accordion">
                      {items}
                    </PanelGroup>
                  </Col>
                </Row>
              </div>
            }
          />
        </Tab>
      </Tabs>
    );
  }
}

export default Workload;
