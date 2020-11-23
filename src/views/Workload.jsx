import React, { Component } from 'react';
import {
  Tabs,
  Tab,
  Accordion,
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormControl,
  ButtonToolbar,
  OverlayTrigger,
  Popover
} from 'react-bootstrap';
import Select from 'react-select';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
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
import { ACTION_DELETE_POD, ACTION_HELM_PURGE } from 'policies.js';
import { getDeploymentRequests, getDeployments } from 'services/workload';
import * as col from 'components/Table/TenkaiColumn';
import TableDeploymentList from './TableDeploymentList';
import ModalDeployment from './ModalDeployment';

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
    confirmInput: '',
    selectedEnvironment: {},
    deploymentRequests: [],
    deploymentCount: 0,
    deploymentStartDate: this.formatDate(new Date()),
    deploymentEndDate: this.formatDate(new Date()),
    deploymentPageSize: 10,
    deploymentPage: 1,
    deploymentModalShow: false,
    deploymentModalTitle: '',
    deploymentModalData: [],
    deploymentModalCount: 0,
    deploymentModalItem: 0,
    deploymentModalPageSize: 10,
    deploymentModalPage: 1
  };

  formatDate(date) {
    const month = this.checkZero(date.getMonth() + 1);
    const day = this.checkZero(date.getDate());
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  checkZero(n) {
    if (String(n).length === 1) {
      return '0' + n;
    }
    return String(n);
  }

  formatTime(date) {
    const hour = this.checkZero(date.getHours());
    const min = this.checkZero(date.getMinutes());
    const sec = this.checkZero(date.getSeconds());
    return `${hour}:${min}:${sec}`;
  }

  formatDateTime(date) {
    return this.formatDate(date) + ' ' + this.formatTime(date);
  }

  navigateToBlueGreenWizard(item) {
    let chartsToDeploy = [];
    let chartName = item.Chart;
    let chartVersion = item.Chart;
    chartName = chartName.substring(0, chartName.lastIndexOf('-'));
    chartVersion = chartVersion.substring(chartVersion.lastIndexOf('-') + 1);
    chartsToDeploy.push(chartName + '@' + chartVersion);
    this.props.updateSelectedChartsToDeploy(chartsToDeploy);

    this.props.history.push({
      pathname: '/admin/blueGreenWizard',
      search: '?envId=' + this.state.selectedEnvironment.value
    });
  }

  componentDidMount() {
    this.loadDeploymentsTabData();
  }

  loadDeploymentsTabData = () => {
    if (
      Object.keys(this.state.selectedEnvironment).length === 0 &&
      this.props.environments.length > 0
    ) {
      this.setState({ selectedEnvironment: this.props.environments[0] }, () => {
        this.listDeploymentRequests();
      });
    }
  };

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
          this.state.selectedEnvironment.value,
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
        this.state.selectedEnvironment.value,
        this.state.targetEnvToPromote.value,
        true
      );
      this.setState({ onShowConfirmModal: false, targetEnvToPromote: {} });
    }
  }

  showConfirmCopyModal(_ref) {
    this.setState({ mode: 'workload', onShowCopyModal: true });
  }

  showConfirmCopyModalFull(_ref) {
    this.setState({ mode: 'full', onShowCopyModal: true });
  }

  listEndpoints() {
    listEndpoints(this, this.state.selectedEnvironment.value, function(
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
    listPods(this, this.state.selectedEnvironment.value, function(self, res) {
      if (res !== undefined && res.data !== null) {
        self.setState({ podList: res.data.pods });
      } else {
        self.setState({ podList: [] });
      }
    });
  }

  listServices() {
    listServices(this, this.state.selectedEnvironment.value, function(
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
      this.state.selectedEnvironment.value,
      function(self, res) {
        if (res !== undefined && res.data !== null && res.data !== undefined) {
          self.setState({ list: res.data.Releases });
        } else {
          self.setState({ list: [] });
        }
      }
    );
  }

  processResponse(response) {
    if (response.data.data) {
      const transform = response.data.data.map(i => {
        let status = 'Success';
        if (!i.processed) {
          status = 'Processing';
        } else if (!i.success) {
          status = 'Error';
        }
        return {
          ID: i.ID,
          chart: i.chart,
          CreatedAt: this.formatDateTime(new Date(i.CreatedAt)),
          UpdatedAt: this.formatDateTime(new Date(i.UpdatedAt)),
          status
        };
      });

      this.setState({
        deploymentRequests: transform,
        deploymentCount: response.data.count
      });
    } else {
      this.setState({
        deploymentRequests: [],
        deploymentCount: response.data.count
      });
    }
  }

  listDeploymentRequests = () => {
    if (this.state && this.state.selectedEnvironment) {
      getDeploymentRequests(
        this.state.deploymentStartDate,
        this.state.deploymentEndDate,
        this.state.selectedEnvironment.value,
        this.state.deploymentPage,
        this.state.deploymentPageSize
      )
        .then(response => this.processResponse(response))
        .catch(error => {
          console.log('error');
          console.log(JSON.stringify(error));
        });
    }
  };

  listDeploymentModal = () => {
    if (this.state && this.state.selectedEnvironment) {
      getDeployments(
        this.state.deploymentModalItem,
        this.state.selectedEnvironment.value,
        this.state.deploymentModalPage,
        this.state.deploymentModalPageSize
      )
        .then(response => {
          console.log(response);
          if (response.data) {
            const transform = response.data.data.map(i => {
              let status = 'Success';
              if (!i.processed) {
                status = 'Processing';
              } else if (!i.success) {
                if (i.message) {
                  status = i.message;
                } else {
                  status = 'There is no detail for this error.';
                }
              }
              return {
                ID: i.ID,
                chart: i.chart,
                CreatedAt: this.formatDateTime(new Date(i.CreatedAt)),
                status
              };
            });

            this.setState({
              deploymentModalShow: true,
              deploymentModalTitle: `Request ID: ${this.state.deploymentModalItem}`,
              deploymentModalData: transform,
              deploymentModalCount: response.data.count
            });
          } else {
            this.setState({
              deploymentModalShow: true,
              deploymentModalTitle: 'No items found.',
              deploymentModalData: [],
              deploymentModalCount: 0
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  updateDeploymentTable = (page, sizePerPage) => {
    this.setState(
      { deploymentPageSize: sizePerPage, deploymentPage: page },
      () => {
        this.listDeploymentRequests(page, sizePerPage);
      }
    );
  };

  updateDeploymentModalTable = (page, sizePerPage) => {
    this.setState(
      { deploymentModalPageSize: sizePerPage, deploymentModalPage: page },
      () => {
        this.listDeploymentModal(page, sizePerPage);
      }
    );
  };

  onTabSelect(_tabName) {}

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

  handleEnvironmentChange = (selectedEnvironment, tab) => {
    const afterChange = () => {
      switch (tab) {
        case 'pod':
          this.listPods();
          break;
        case 'svc':
          this.listServices();
          break;
        case 'ep':
          this.listEndpoints();
          break;
        case 'helm':
          this.listDeploymentsByEnv();
          break;
        case 'deployments':
          this.setState({ selectedEnvironment });
          this.listDeploymentRequests();
          break;
        default:
          break;
      }
    };

    this.setState({ selectedEnvironment }, afterChange);
  };

  renderSelectEnv = tab => {
    return (
      <Col md={3}>
        <FormGroup>
          <FormLabel>Environment</FormLabel>
          <Select
            value={this.state.selectedEnvironment}
            onChange={e => this.handleEnvironmentChange(e, tab)}
            options={this.props.environments}
            className="react-select-zindex-4"
          />
        </FormGroup>
      </Col>
    );
  };

  renderDeploymentColumns = () => {
    let columns = [];
    columns.push(col.addId());
    columns.push(col.addCol('CreatedAt', 'Created At', '25%'));
    columns.push(col.addCol('status', 'Status', '25%'));
    columns.push(
      col.addColBtn(
        'items',
        'Items',
        col.renderBtn(this.onViewItems, 'pe-7s-more')
      )
    );
    return columns;
  };

  renderDeploymentModalColumns = () => {
    let columns = [];
    columns.push(col.addId());
    columns.push(col.addCol('CreatedAt', 'Created At', '30%'));
    columns.push(col.addCol('chart', 'Chart', '50%'));
    columns.push(this.addColStatus('10%'));
    return columns;
  };

  addColStatus = wdt => {
    return col.addColBtn(
      'status',
      'Status',
      this.renderStatusBtn('pe-7s-edit'),
      wdt
    );
  };

  renderStatusBtn = () => {
    return (cell, row) => {
      if (row.status === 'Success') {
        return (
          <Button className="link-button">
            <i className="pe-7s-edit pe-7s-check" />
          </Button>
        );
      } else {
        return this.renderErrorOverlay(row);
      }
    };
  };

  renderErrorOverlay = row => {
    return (
      <OverlayTrigger
        placement="left"
        delay={{ show: 150, hide: 200 }}
        overlay={this.renderErrorTooltip(row.status)}
      >
        <Button className="link-button" value={row}>
          <i className="pe-7s-attention cell-button-icon" />
        </Button>
      </OverlayTrigger>
    );
  };

  renderErrorTooltip = message => (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Error detail</Popover.Title>
      <Popover.Content>{message}</Popover.Content>
    </Popover>
  );

  onCloseDeploymentModal = () => {
    this.setState({ deploymentModalShow: false });
  };

  onViewItems = item => {
    this.setState(
      {
        deploymentModalItem: item.ID
      },
      () => {
        this.listDeploymentModal();
      }
    );
  };

  render() {
    const items = this.state.list
      .filter(
        d =>
          this.state.inputFilter === '' ||
          d.Name.includes(this.state.inputFilter)
      )
      .map((item, key) => (
        <ReleasePanel
          allowPurge={!this.props.hasEnvironmentPolicy(ACTION_HELM_PURGE)}
          eventKey={key}
          keycloak={this.props.keycloak}
          key={key}
          item={item}
          selectedEnvironment={this.state.selectedEnvironment}
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
        defaultActiveKey="deployments"
        id="workload-tab"
        onSelect={this.onTabSelect.bind(this)}
      >
        <Tab eventKey="deployments" title="Deployments">
          <CardTenkai
            title=""
            content={
              <div>
                <Row>
                  <Col md={12}>
                    <ModalDeployment
                      show={this.state.deploymentModalShow}
                      title={this.state.deploymentModalTitle}
                      data={this.state.deploymentModalData}
                      count={this.state.deploymentModalCount}
                      onLoad={this.updateDeploymentModalTable}
                      columns={this.renderDeploymentModalColumns()}
                      close={() => this.onCloseDeploymentModal()}
                    />
                  </Col>
                </Row>
                <Row className="align-items-md-end">
                  {this.renderSelectEnv('deployments')}
                  <Col md={2}>
                    <FormGroup>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl
                        value={this.state.deploymentStartDate}
                        onChange={e =>
                          this.setState({
                            deploymentStartDate: e.target.value
                          })
                        }
                        style={{ width: '100%' }}
                        type="date"
                        placeholder="Start Date"
                        aria-label="Start Date"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <FormGroup>
                      <FormLabel>End Date</FormLabel>
                      <FormControl
                        value={this.state.deploymentEndDate}
                        onChange={e =>
                          this.setState({
                            deploymentEndDate: e.target.value
                          })
                        }
                        style={{ width: '100%' }}
                        type="date"
                        placeholder="End Date"
                        aria-label="End Date"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <Button
                      className="btn btn-info"
                      size="sm"
                      style={{ marginBottom: '20px' }}
                      onClick={() => this.listDeploymentRequests()}
                    >
                      <i className="pe-7s-refresh-2" /> Refresh
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <TableDeploymentList
                      data={this.state.deploymentRequests}
                      count={this.state.deploymentCount}
                      onLoad={this.updateDeploymentTable}
                      columns={this.renderDeploymentColumns()}
                    />
                  </Col>
                </Row>
              </div>
            }
          />
        </Tab>
        <Tab eventKey="pods" title="Pods">
          <CardTenkai
            title=""
            content={
              <div>
                <Row className="align-items-md-end">
                  {this.renderSelectEnv('pod')}

                  <Col xs={4}>
                    <FormGroup>
                      <FormLabel>Pod Search</FormLabel>
                      <FormControl
                        value={this.state.podInputFilter}
                        onChange={this.onChangePodInputHandler.bind(this)}
                        style={{ width: '100%' }}
                        type="text"
                        aria-label="Search"
                      />
                    </FormGroup>
                  </Col>

                  <Col xs={5}>
                    <Button
                      className="btn btn-info"
                      size="sm"
                      onClick={this.refreshPods.bind(this)}
                      style={{ marginBottom: '20px' }}
                    >
                      <i className="pe-7s-refresh-2" /> Refresh
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <PodPanel
                      allowDeletePod={
                        !this.props.hasEnvironmentPolicy(ACTION_DELETE_POD)
                      }
                      selectedEnvironment={this.state.selectedEnvironment}
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
          <CardTenkai
            title=""
            content={
              <div>
                <Row className="align-items-md-end">
                  {this.renderSelectEnv('svc')}

                  <Col xs={4}>
                    <FormGroup>
                      <FormLabel>Service Search</FormLabel>
                      <FormControl
                        value={this.state.serviceInputFilter}
                        onChange={this.onChangeServiceInputHandler.bind(this)}
                        style={{ width: '100%' }}
                        type="text"
                        aria-label="Search"
                      />
                    </FormGroup>
                  </Col>

                  <Col xs={5}>
                    <Button
                      className="btn btn-info"
                      size="sm"
                      onClick={this.refreshServices.bind(this)}
                      style={{ marginBottom: '20px' }}
                    >
                      <i className="pe-7s-refresh-2" /> Refresh
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <ServicePanel
                      selectedEnvironment={this.state.selectedEnvironment}
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
          <CardTenkai
            title=""
            content={
              <div>
                <Row className="align-items-md-end">
                  {this.renderSelectEnv('ep')}

                  <Col xs={4}>
                    <FormGroup>
                      <FormLabel>Public endpoint search</FormLabel>
                      <FormControl
                        value={this.state.endpointInputFilter}
                        onChange={this.onChangeEndpointInputHandler.bind(this)}
                        style={{ width: '100%' }}
                        type="text"
                        aria-label="Search"
                      />
                    </FormGroup>
                  </Col>

                  <Col xs={5}>
                    <Button
                      className="btn btn-info"
                      size="sm"
                      onClick={this.refreshEndpoints.bind(this)}
                      style={{ marginBottom: '20px' }}
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
          <CardTenkai
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
                />

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
                        type="text"
                        name="confirmInput"
                        value={this.state.confirmInput}
                        onChange={this.handleConfirmInputChange.bind(this)}
                      />
                      <hr />
                      <ButtonToolbar>
                        <Button
                          className="btn btn-danger btn-fill"
                          size="sm"
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
                          size="sm"
                          onClick={this.onCloseConfirmModal.bind(this)}
                        >
                          <i className="pe-7s-smile" /> Cancel
                        </Button>
                      </ButtonToolbar>
                    </div>
                  }
                />

                <Row className="align-items-md-end">
                  {this.renderSelectEnv('helm')}

                  <Col xs={4}>
                    <FormGroup>
                      <FormLabel>Release Search</FormLabel>
                      <FormControl
                        value={this.state.inputFilter}
                        onChange={this.onChangeInputHandler.bind(this)}
                        style={{ width: '100%' }}
                        type="text"
                        aria-label="Search"
                      />
                    </FormGroup>
                  </Col>

                  <Col xs={5}>
                    <ButtonToolbar>
                      <Button
                        className="btn btn-info"
                        size="sm"
                        onClick={this.refreshReleases.bind(this)}
                        style={{ marginBottom: '20px' }}
                      >
                        <i className="pe-7s-refresh-2" /> Refresh
                      </Button>

                      <Button
                        className="btn btn-success btn-fill"
                        size="sm"
                        onClick={this.showConfirmCopyModal.bind(this)}
                        disabled={
                          !this.props.keycloak.hasRealmRole('tenkai-admin')
                        }
                        style={{ marginBottom: '20px' }}
                      >
                        <i className="pe-7s-smile" /> Copy Releases to another
                        namespace
                      </Button>

                      <Button
                        className="btn btn-danger btn-fill"
                        size="sm"
                        onClick={this.showConfirmCopyModalFull.bind(this)}
                        disabled={
                          !this.props.keycloak.hasRealmRole('tenkai-admin')
                        }
                        style={{ marginBottom: '20px' }}
                      >
                        <i className="pe-7s-smile" /> Replicate full environment
                      </Button>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Accordion defaultActiveKey="0" id="workload-accordion">
                      {items}
                    </Accordion>
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
