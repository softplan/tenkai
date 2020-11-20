import {
  getAllEnvironments,
  getHelmCommand,
  multipleInstall,
  retrieveSettings,
  validateVariables
} from 'client-api/apicall.jsx';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import Button from 'components/CustomButton/CustomButton.jsx';
import HelmVariables from 'components/Deployment/HelmVariables.jsx';
import CopyModal from 'components/Modal/CopyModal.jsx';
import HelmCommandModal from 'components/Modal/HelmCommandModal.jsx';
import { ACTION_DEPLOY, ACTION_SAVE_VARIABLES } from 'policies.js';
import queryString from 'query-string';
import React, { Component } from 'react';
import {
  ButtonToolbar,
  Col,
  Container,
  Row,
  FormGroup,
  FormLabel
} from 'react-bootstrap';
import Select from 'react-select';

class VariablesWizard extends Component {
  constructor(props) {
    super(props);
    const values = queryString.parse(props.location.search);
    this.state = {
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
      envsToCopy: [],
      productVersionId: values.productVersionId,
      envId: values.selectedEnvId
    };
  }

  async componentDidMount() {
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

    let vCommonValuesConfigMapChart = '';
    let vCommonVariablesConfigMapChart = '';
    let vCanaryChart = '';

    const result = await retrieveSettings({ list: data }, this);

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
    this.setState(
      {
        vCommonValuesConfigMapChart: vCommonValuesConfigMapChart,
        vCommonVariablesConfigMapChart: vCommonVariablesConfigMapChart,
        vCanaryChart: vCanaryChart,
        charts: helmCharts,
        chartVersions: chartVersions,
        desiredTags: desiredTags
      },
      async () => this.didMountCallback(helmCharts)
    );
  }

  getSelectedEnvironment() {
    if (this.state.envId) {
      const found = this.props.environments.find(
        e => String(e.value) === String(this.state.envId)
      );

      if (found) {
        return [found];
      }
    }
    return [];
  }

  didMountCallback = async () => {
    await this.getChildVariables();
    this.props.handleLoading(false);
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

  onSaveVariablesClick = () => {
    this.setState({ invalidVariables: {}, chartsValidated: 0 }, () => {
      this.props.handleLoading(true);
      let count = this.state.charts.length;
      let index = 0;

      this.state.charts.forEach((item, key) => {
        this.refs['h' + key].save(() => {
          index++;
          if (index >= count) {
            this.props.handleNotification(
              'custom',
              'success',
              'Variables saved!'
            );
            this.props.handleLoading(false);
          }
        });
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
        environmentIds: [parseInt(this.state.envId)],
        deployables: []
      };

      let count = 0;
      const totalCharts = this.state.charts.length;

      this.state.charts.forEach((item, key) => {
        this.refs['h' + key].save(list => {
          for (let x = 0; x < list.length; x++) {
            let data = list[x];
            if (data.name.includes('-gcm')) {
              continue;
            }
            payload.deployables.push(data);
          }
          count++;
          if (count === totalCharts) {
            multipleInstall(payload, this);
          }
        });
      });
    });
  };

  onValidateVariablesClick = async () => {
    this.validateVars(this.state.charts);

    this.state.charts.forEach((item, key) => {
      const currentRef = this.refs['h' + key];
      if (this.hasConfigMap(currentRef)) {
        currentRef.refs.hConfigMap.validateConfigMap(this);
      }
    });
  };

  hasConfigMap(currentRef) {
    return (
      currentRef !== undefined &&
      currentRef.refs !== undefined &&
      currentRef.refs.hConfigMap !== undefined
    );
  }

  validateVars(helmCharts) {
    helmCharts.forEach(async chart => {
      await validateVariables(
        this,
        parseInt(this.props.selectedEnvironment.value),
        chart,
        this.callbackValidate
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
          chartVersions={this.state.chartVersions[item]}
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

        <Container fluid>
          <Row>
            <Col md={12}>
              <CardTenkai
                title=""
                content={
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <FormLabel>Environments</FormLabel>
                        <Select
                          value={this.getSelectedEnvironment()}
                          options={this.props.environments}
                          className="react-select-zindex-4"
                          isMulti
                          closeMenuOnSelect={false}
                          isDisabled={true}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={8}>
                      <div align="right">
                        <ButtonToolbar style={{ display: 'block' }}>
                          <Button
                            variant="secondary"
                            onClick={this.onHelmCommand}
                          >
                            Show Helm Command
                          </Button>

                          <Button
                            variant="secondary"
                            onClick={this.onValidateVariablesClick}
                          >
                            Validate Variables
                          </Button>

                          <Button
                            variant="secondary"
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
                            variant="primary"
                            onClick={this.install}
                            disabled={
                              !this.props.hasEnvironmentPolicy(ACTION_DEPLOY)
                            }
                          >
                            Request Install
                          </Button>
                        </ButtonToolbar>
                      </div>
                    </Col>
                  </Row>
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
