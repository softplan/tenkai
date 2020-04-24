import React, { Component } from 'react';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import {
  Row,
  Col,
  Table,
  FormGroup,
  ButtonToolbar,
  FormLabel,
  FormControl,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import axios from 'axios';
import ArrayVariable from 'components/Deployment/ArrayVariable.jsx';
import IstioVariable from './IstioVariable';
import { TENKAI_API_URL } from 'env.js';
import { ConfigMap } from 'components/Deployment/ConfigMap.jsx';
import Button from 'components/CustomButton/CustomButton.jsx';
import { CanaryCard } from 'components/Deployment/CanaryCard.jsx';
import { getTagsOfImage } from 'client-api/apicall.jsx';
import Select from 'react-select';
import { ACTION_SAVE_VARIABLES } from 'policies.js';

export class HelmVariables extends Component {
  state = {
    chartName: '',
    chartVersion: '',
    variables: {},
    values: {},
    defaultApiPath: '',
    injectIstioCar: true,
    enableVirtualService: true,
    containerImage: '',
    containerTag: '',
    selectedTag: {},
    hosts: {},
    hostCount: 0,
    simpleChart: '',
    canaryChart: '',
    canaryShowing: false,
    releaseName: '',
    dontCreateService: false,
    applyConfigMap: false,
    tags: []
  };

  constructor(props) {
    super(props);

    this.state.chartName = props.chartName;
    this.state.chartVersion = props.chartVersion;

    let scope = this.state.chartName;
    var n = scope.indexOf('/');
    let releaseName = scope.substring(n + 1);
    this.state.releaseName = releaseName;

    if (this.props.canary) {
      this.state.releaseName = this.state.releaseName + '-beta';
      this.state.dontCreateService = true;
      this.state.canaryShowing = true;
      this.state.vCommonValuesConfigMapChart = this.props.vCommonValuesConfigMapChart;
      this.state.vCommonVariablesConfigMapChart = this.props.vCommonVariablesConfigMapChart;
      this.state.vCanaryChart = this.props.vCanaryChart;
    }
  }

  async componentDidMount() {
    this.addHost();
  }

  addDynamicVariableClick(variableName) {
    let dbArray = [...this.state.variables[variableName]];

    let item = {};
    if (dbArray.length > 0) {
      for (let element of dbArray.keys()) {
        item = dbArray[element];
      }
    } else {
      item = { name: '', value: '' };
    }
    dbArray.push(item);
    this.setState(state => ({
      variables: {
        ...state.variables,
        [variableName]: dbArray
      }
    }));
  }

  onInputChangeFromChild(name, value) {
    this.setState(state => ({
      values: {
        ...state.values,
        [name]: value
      }
    }));
  }

  onInputChange = event => {
    const { value, name } = event.target;
    this.setState(state => ({
      values: {
        ...state.values,
        [name]: value
      }
    }));
  };

  saveTag(callbackFunction) {
    console.log('save ' + this.props.envId);
    const scope = this.state.chartName;
    const chartVersion = this.state.chartVersion;
    const environmentId = parseInt(this.props.envId);
    let payload = { data: [] };

    payload.data.push({
      scope: scope,
      chartVersion: chartVersion,
      name: 'image.tag',
      value: this.state.containerTag,
      environmentId: environmentId
    });

    let data = payload.data;

    axios
      .post(TENKAI_API_URL + '/saveVariableValues', { data })
      .then(() => {
        let list = [];
        //Main
        let installPayload = {};
        const environmentId = parseInt(this.props.envId);

        installPayload.name = this.state.releaseName;
        installPayload.chart = scope;
        installPayload.environmentId = environmentId;
        installPayload.chartVersion = this.state.chartVersion;
        list.push(installPayload);
        callbackFunction(list);
      })
      .catch(error => {
        this.props.handleNotification('general_fail', 'error');
        console.log('Error saveVariableValues: ' + error.message);
      });
  }

  save(callbackFunction) {
    console.log('save ' + this.props.envId);
    const scope = this.state.chartName;
    const chartVersion = this.state.chartVersion;
    const environmentId = parseInt(this.props.envId);
    let payload = { data: [] };

    const elements = this.state.values;

    Object.keys(this.state.values).map(function(key) {
      payload.data.push({
        scope: scope,
        chartVersion: chartVersion,
        name: key,
        value: elements[key],
        environmentId: environmentId
      });
      return null;
    });

    payload.data.push({
      scope: scope,
      chartVersion: chartVersion,
      name: 'istio.enabled',
      value: this.state.injectIstioCar ? 'true' : 'false',
      environmentId: environmentId
    });
    payload.data.push({
      scope: scope,
      chartVersion: chartVersion,
      name: 'istio.virtualservices.enabled',
      value: this.state.enableVirtualService ? 'true' : 'false',
      environmentId: environmentId
    });
    payload.data.push({
      scope: scope,
      chartVersion: chartVersion,
      name: 'istio.virtualservices.apiPath',
      value: this.state.defaultApiPath,
      environmentId: environmentId
    });
    payload.data.push({
      scope: scope,
      chartVersion: chartVersion,
      name: 'image.repository',
      value: this.state.containerImage,
      environmentId: environmentId
    });
    payload.data.push({
      scope: scope,
      chartVersion: chartVersion,
      name: 'image.tag',
      value: this.state.containerTag,
      environmentId: environmentId
    });
    payload.data.push({
      scope: scope,
      chartVersion: chartVersion,
      name: 'service.apply',
      value: this.state.dontCreateService ? 'false' : 'true',
      environmentId: environmentId
    });

    const hosts = this.state.hosts;
    Object.keys(hosts).map(function(key) {
      payload.data.push({
        scope: scope,
        chartVersion: chartVersion,
        name: key,
        value: hosts[key],
        environmentId: environmentId
      });
      return null;
    });

    let data = payload.data;

    axios
      .post(TENKAI_API_URL + '/saveVariableValues', { data })
      .then(() => {
        if (this.state.applyConfigMap && this.refs.hConfigMap !== undefined) {
          this.refs.hConfigMap.save(data => {
            let list = [];

            //Main
            let installPayload = {};
            const environmentId = parseInt(this.props.envId);

            installPayload.name = this.state.releaseName;
            installPayload.chart = scope;
            installPayload.environmentId = environmentId;

            list.push(installPayload);
            list.push(data);
            callbackFunction(list);
          });
        } else {
          let list = [];
          //Main
          let installPayload = {};
          const environmentId = parseInt(this.props.envId);

          installPayload.name = this.state.releaseName;
          installPayload.chart = scope;
          installPayload.environmentId = environmentId;
          installPayload.chartVersion = this.state.chartVersion;
          list.push(installPayload);
          callbackFunction(list);
        }
      })
      .catch(error => {
        this.props.handleNotification('general_fail', 'error');
        console.log('Error saveVariableValues: ' + error.message);
      });
  }

  async retrieveTagsOfImage(imageName) {
    console.log('ImageName: ' + imageName);
    getTagsOfImage(this, imageName, (self, data) => {
      var arr = [];
      if (data.tags != null) {
        for (var x = 0; x < data.tags.length; x++) {
          var element = data.tags[x];
          arr.push({ value: element.tag, label: element.tag });
        }
      }
      this.setState({ tags: arr });
    });
  }

  async listVariables(environmentId) {
    this.props.handleLoading(true);
    this.setState({ values: {} }, () => {
      axios
        .post(TENKAI_API_URL + '/listVariables', {
          environmentId: environmentId,
          scope: this.state.chartName
        })
        .then(response => {
          this.addToValues(this, response.data.Variables);
          this.fillIstioFields(response.data.Variables);
          this.fillImageFields(response.data.Variables);

          if (
            this.state.applyConfigMap &&
            this.refs['hConfigMap'] !== undefined
          ) {
            this.refs['hConfigMap'].listVariables(environmentId);
          }
          this.props.handleLoading(false);
        })
        .catch(error => {
          this.props.handleLoading(false);
          console.log(error.message);
          this.props.handleNotification('general_fail', 'error');
        });
    });
  }

  async hasConfigMap(chartName, chartVersion) {
    await axios
      .post(TENKAI_API_URL + '/hasConfigMap', { chartName, chartVersion })
      .then(response => {
        if (response.data.result === 'true') {
          this.setState({ applyConfigMap: true });
        } else {
          this.setState({ applyConfigMap: false });
        }
      });
  }

  async getVariables(chartName, chartVersion) {
    await this.hasConfigMap(chartName, chartVersion);

    this.props.handleLoading(true);

    await axios
      .post(TENKAI_API_URL + '/getChartVariables', { chartName, chartVersion })
      .then(response => {
        this.props.handleLoading(false);
        if (response.data.istio != null) {
          this.setState({
            defaultApiPath: response.data.istio.virtualservices.apiPath,
            injectIstioCar: response.data.istio.enabled,
            enableVirtualService: response.data.istio.virtualservices.enabled,
            dontCreateService: response.data.service.apply ? false : true
          });
        }

        if (response.data.image) {
          if (this.props.desiredTag && this.props.desiredTag !== '') {
            if (this.state.containerTag !== this.props.desiredTag) {
              this.setState({
                containerImage: response.data.image.repository,
                containerTag: this.props.desiredTag,
                selectedTag: {
                  value: this.props.desiredTag,
                  label: this.props.desiredTag
                }
              });
            }
          } else {
            this.setState(
              {
                containerImage: response.data.image.repository,
                containerTag: response.data.image.tag,
                selectedTag: {
                  value: response.data.image.tag,
                  label: response.data.image.tag
                }
              },
              () => {
                if (this.state.containerImage !== '') {
                  this.retrieveTagsOfImage(this.state.containerImage);
                }
              }
            );
          }
        }

        if (response.data.app !== null) {
          this.setState({ variables: response.data.app });
        } else {
          this.setState({ variables: [] });
        }

        const scope = this.state.chartName;
        const environmentId = parseInt(this.props.envId);

        this.props.handleLoading(true);
        axios
          .post(TENKAI_API_URL + '/listVariables', {
            environmentId: environmentId,
            scope: scope
          })
          .then(response => {
            this.props.handleLoading(false);
            this.addToValues(this, response.data.Variables);
            this.fillIstioFields(response.data.Variables);
            this.fillImageFields(response.data.Variables);
          })
          .catch(error => {
            console.log(error.message);
            this.props.handleNotification('general_fail', 'error');
            this.props.handleLoading(false);
          });
      })
      .catch(error => {
        this.props.handleLoading(false);
        console.log('Error here: ' + JSON.stringify(error));
        this.props.handleNotification('general_fail', 'error');
      });
  }

  getRootName(name) {
    let i = name.indexOf('[');
    let value = name.substring(0, i);
    return value;
  }

  fillImageFields(variables) {
    variables.forEach(value => {
      switch (value.name) {
        case 'image.repository':
          if (this.state.containerImage !== value.value && value.value !== '') {
            this.setState({ containerImage: value.value }, () => {
              this.retrieveTagsOfImage(this.state.containerImage);
            });
          }
          break;
        case 'image.tag':
          console.log('desiredTag=' + this.props.desiredTag);
          if (this.props.desiredTag && this.props.desiredTag !== '') {
            if (this.state.containerTag !== this.props.desiredTag) {
              this.setState({
                containerTag: this.props.desiredTag,
                selectedTag: {
                  value: this.props.desiredTag,
                  label: this.props.desiredTag
                }
              });
            }
          } else {
            if (this.state.containerTag !== value.value) {
              this.setState({
                containerTag: value.value,
                selectedTag: { value: value.value, label: value.value }
              });
            }
          }

          break;
        default:
          break;
      }
    });
  }

  fillIstioFields(variables) {
    variables.forEach(value => {
      switch (value.name) {
        case 'istio.enabled':
          this.setState({
            injectIstioCar: value.value === 'true' ? true : false
          });
          break;
        case 'service.apply':
          this.setState({
            dontCreateService:
              value.value === 'true' && !this.props.canary ? false : true
          });
          break;
        case 'istio.virtualservices.enabled':
          this.setState({
            enableVirtualService: value.value === 'true' ? true : false
          });
          break;
        case 'istio.virtualservices.apiPath':
          this.setState({ defaultApiPath: value.value });
          break;
        default:
          if (value.name.indexOf('istio.virtualservices.hosts[') > -1) {
            let name = value.name;
            let varValue = value.value;
            this.onHostChange(name, varValue);
          }
      }
    });
  }

  getTagsOfImage() {}

  addToValues(self, variables) {
    let dynamicEntries = new Map();
    let valuesMap = new Map();

    variables.forEach(value => {
      valuesMap[value.name] = value.value;
      if (value.name.indexOf('].') > -1) {
        if (dynamicEntries[this.getRootName(value.name)] !== undefined) {
          dynamicEntries[this.getRootName(value.name)]++;
        } else {
          dynamicEntries[this.getRootName(value.name)] = 1;
        }
      }
    });

    Object.keys(dynamicEntries).map(function(key) {
      let max = dynamicEntries[key] / 2 - 1;
      let currentLenght =
        self.state.variables[key] !== undefined
          ? self.state.variables[key].length
          : 0;

      if (max >= currentLenght) {
        for (let x = 0; x < max; x++) {
          self.addDynamicVariableClick(key);
        }
      }

      return null;
    });

    this.setState({
      values: valuesMap
    });
  }

  handleContainerImageChange = event => {
    const value = event.target.value;
    this.setState({ containerImage: value }, () => {
      this.retrieveTagsOfImage(this.state.containerImage);
    });
  };

  handleContainerTagChange = selectedTag => {
    this.setState({
      selectedTag: selectedTag,
      containerTag: selectedTag.value
    });
  };

  onApiGatewayPathChange(newValue) {
    this.setState({ defaultApiPath: newValue });
  }

  handleOnInjectIstioCar(newValue) {
    this.setState({ injectIstioCar: newValue });
  }

  handleEnableVirtualService(newValue) {
    this.setState({ enableVirtualService: newValue });
  }

  addHost() {
    let name = 'istio.virtualservices.hosts[' + this.state.hostCount + ']';
    this.onHostChange(name, '');
    this.setState({
      hostCount: this.state.hostCount + 1
    });
  }

  onHostChange(name, value) {
    this.setState(state => ({
      hosts: {
        ...state.hosts,
        [name]: value
      }
    }));
  }

  getConfigMapName() {
    let configMapName = this.state.releaseName + '-gcm';
    if (this.props.canary) {
      configMapName = configMapName + '-beta';
    }
    return configMapName;
  }

  showHideCanaryOptions() {
    let value = !this.state.canaryShowing;
    this.setState({ canaryShowing: value });
  }

  handleReleaseNameChange = event => {
    const value = event.target.value;
    this.setState({ releaseName: value });
  };

  handleDontCreateServiceChange = value => {
    this.setState({ dontCreateService: value });
  };

  isValid(key) {
    if (this.hasInvalidVar(key)) {
      return 'form-control is-invalid';
    }
    return '';
  }

  hasInvalidVar(key) {
    return !!this.props.invalidVariables && !!this.props.invalidVariables[key];
  }

  getInvalidMsg(name, ruleType) {
    const v = this.props.invalidVariables[name].find(
      o => o.ruleType === ruleType
    );
    return `Value should ${this.generateMsg(v.ruleType, v.valueRule)}`;
  }

  generateMsg(ruleType, valueRule) {
    switch (ruleType) {
      case 'NotEmpty':
        return 'be not empty.';
      case 'StartsWith':
        return `starts with '${valueRule}'.`;
      case 'EndsWith':
        return `ends with '${valueRule}'.`;
      case 'RegEx':
        return `complies to regex '${valueRule}'.`;
      default:
        break;
    }
  }

  renderCM() {
    return (
      this.state.applyConfigMap &&
      this.state.chartName !== this.state.simpleChart
    );
  }

  renderVariables(variables) {
    return Object.keys(variables).map(key => {
      if (typeof variables[key] == 'object') {
        return (
          <ArrayVariable
            key={key}
            name={key}
            disabled={!this.props.hasEnvironmentPolicy(ACTION_SAVE_VARIABLES)}
            variables={variables[key]}
            values={this.state.values}
            onCreateDynamicVariable={this.addDynamicVariableClick.bind(this)}
            onInputChange={this.onInputChangeFromChild.bind(this)}
          />
        );
      } else {
        const value = this.state.values[key] || '';
        const keyValue = '' + variables[key];
        const tooltip = <Tooltip id="tooltip">{keyValue}</Tooltip>;
        return (
          <tr key={key}>
            <td className="word-wrap">{key}</td>
            <td>
              <OverlayTrigger
                placement="bottom"
                overlay={tooltip}
                delayShow={300}
                delayHide={150}
              >
                <input
                  name={key}
                  disabled={
                    !this.props.hasEnvironmentPolicy(ACTION_SAVE_VARIABLES)
                  }
                  value={value}
                  onChange={this.onInputChange}
                  type="text"
                  style={{ width: '100%' }}
                  className={this.isValid(key)}
                />
              </OverlayTrigger>
              {this.hasInvalidVar(key) &&
                this.props.invalidVariables[key].map(key => {
                  return (
                    <div key={key} className="invalid-feedback">
                      {this.getInvalidMsg(key.name, key.ruleType)}
                    </div>
                  );
                })}
            </td>
          </tr>
        );
      }
    });
  }

  render() {
    let items = this.renderVariables(this.state.variables);
    return (
      <div>
        <Row>
          <Col md={12}>
            <CardTenkai
              title={this.state.chartName}
              content={
                <div>
                  <div>
                    <ButtonToolbar>
                      <Button
                        className="btn-primary"
                        disabled={
                          this.props.canary ||
                          !this.props.hasEnvironmentPolicy(
                            ACTION_SAVE_VARIABLES
                          )
                        }
                        onClick={this.props.copyVariables.bind(
                          this,
                          this.props.xref
                        )}
                        size="sm"
                      >
                        <i className="pe-7s-magic-wand" /> Copy config from
                        another environment
                      </Button>

                      <Button
                        className="btn-warning"
                        disabled={
                          this.props.canary ||
                          !this.props.hasEnvironmentPolicy(
                            ACTION_SAVE_VARIABLES
                          )
                        }
                        onClick={this.showHideCanaryOptions.bind(this)}
                        size="sm"
                      >
                        <i className="pe-7s-magic-wand" />{' '}
                        {this.state.canaryShowing
                          ? 'Hide Advanved Option'
                          : 'Show Advanced Options'}
                      </Button>
                    </ButtonToolbar>

                    <hr />
                  </div>

                  {this.state.canaryShowing ? (
                    <div>
                      <CanaryCard
                        releaseName={this.state.releaseName}
                        handleReleaseNameChange={this.handleReleaseNameChange.bind(
                          this
                        )}
                        dontCreateService={this.state.dontCreateService}
                        handleDontCreateServiceChange={this.handleDontCreateServiceChange.bind(
                          this
                        )}
                      />
                      <hr />
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {this.shouldRenderImageAndTag() ? (
                    <form>
                      <Row>
                        <Col xs={6}>
                          <FormGroup>
                            <FormLabel>Container image</FormLabel>
                            <FormControl
                              name="image"
                              readOnly={true}
                              type="text"
                              bsPrefix="form-control"
                              value={this.state.containerImage}
                              onChange={this.handleContainerImageChange}
                            />
                          </FormGroup>
                        </Col>
                        <Col xs={3}>
                          <FormGroup>
                            <FormLabel>Container Tag</FormLabel>
                            <Select
                              value={this.state.selectedTag}
                              onChange={this.handleContainerTagChange}
                              options={this.state.tags}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </form>
                  ) : (
                    <div></div>
                  )}

                  {this.state.chartName !== this.state.simpleChart ? (
                    <div>
                      <IstioVariable
                        disabled={
                          !this.props.hasEnvironmentPolicy(
                            ACTION_SAVE_VARIABLES
                          )
                        }
                        defaultApiPath={this.state.defaultApiPath}
                        injectIstioCar={this.state.injectIstioCar}
                        enableVirtualService={this.state.enableVirtualService}
                        hosts={this.state.hosts}
                        onAddHost={this.addHost.bind(this)}
                        onApiGatewayPathChange={this.onApiGatewayPathChange.bind(
                          this
                        )}
                        onInjectIstioCar={this.handleOnInjectIstioCar.bind(
                          this
                        )}
                        onEnableVirtualService={this.handleEnableVirtualService.bind(
                          this
                        )}
                        onHostChange={this.onHostChange.bind(this)}
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}

                  <hr />

                  <div>
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th style={{ width: '20%' }}>Variable</th>
                          <th style={{ width: '80%' }}>Environment Value</th>
                        </tr>
                      </thead>
                      <tbody>{items}</tbody>
                    </Table>
                  </div>

                  <hr />

                  {this.renderCM() ? (
                    <ConfigMap
                      vCommonValuesConfigMapChart={
                        this.props.vCommonValuesConfigMapChart
                      }
                      handleLoading={this.props.handleLoading}
                      handleNotification={this.props.handleNotification}
                      key="ConfigMap"
                      chartName={this.props.vCommonValuesConfigMapChart}
                      chartVersion={this.state.configMapChartVersion}
                      ref="hConfigMap"
                      configMapName={this.getConfigMapName()}
                      envId={this.props.envId}
                      hasEnvironmentPolicy={this.props.hasEnvironmentPolicy.bind(
                        this
                      )}
                    />
                  ) : (
                    <div></div>
                  )}
                </div>
              }
            />
          </Col>
        </Row>
      </div>
    );
  }

  shouldRenderImageAndTag() {
    return (
      this.state.chartName !== this.state.simpleChart &&
      this.state.chartName !== this.state.canaryChart
    );
  }
}

export default HelmVariables;
