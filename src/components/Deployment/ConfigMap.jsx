import React, { Component } from 'react';
import { Table, FormGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios from 'axios';
import TENKAI_API_URL from 'env.js';
import { FormInputs } from 'components/FormInputs/FormInputs.jsx';
import { ACTION_SAVE_VARIABLES } from 'policies.js';
import { validateVariables } from 'client-api/apicall.jsx';

export class ConfigMap extends Component {
  state = {
    chartName: '',
    ChartVersion: '',
    variables: {},
    values: {},
    configMapChart: '',
    invalidVariables: {}
  };

  constructor(props) {
    super(props);
    console.log(this.props.vCommonValuesConfigMapChart);
    this.state.configMapChart = this.props.vCommonValuesConfigMapChart;
  }

  componentDidMount() {
    this.setState(
      {
        chartName: this.props.chartName,
        chartVersion: this.props.chartVersion
      },
      () => {
        this.getVariables(this.state.chartName, this.state.chartVersion);
        this.validateVars(this.props.configMapName, this.callbackValidate);
      }
    );
  }

  async validateVars(chart, callback) {
    await validateVariables(this, parseInt(this.props.envId), chart, callback);
  }

  callbackValidate = invalidVars => {
    const invalidToMap = this.arrayToMap(invalidVars);

    this.setState({
      invalidVariables: {
        ...this.state.invalidVariables,
        ...invalidToMap
      }
    });
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

  save(callbackFunction) {
    this.setState({ invalidVariables: {} }, () => {
      const scope = this.props.configMapName;
      const chartName = this.state.chartName;
      const environmentId = parseInt(this.props.envId);
      let payload = { data: [] };

      const elements = this.state.values;

      Object.keys(this.state.values).map(function(key, index) {
        payload.data.push({
          scope: scope,
          name: key,
          value: elements[key],
          environmentId: environmentId
        });
        return null;
      });

      let data = payload.data;

      axios
        .post(TENKAI_API_URL + '/saveVariableValues', { data })
        .then(res => {
          let installPayload = {};
          const environmentId = parseInt(this.props.envId);
          installPayload.name = this.props.configMapName;
          installPayload.chart = chartName;
          installPayload.environmentId = environmentId;
          this.validateVars(this.props.configMapName, this.callbackValidate);
          callbackFunction(installPayload);
        })
        .catch(error => {
          this.props.handleNotification('general_fail', 'error');
          console.log('Error saveVariableValues: ' + error.message);
        });
    });
  }

  async listVariables(environmentId) {
    let scope = this.props.configMapName;
    axios
      .post(TENKAI_API_URL + '/listVariables', {
        environmentId: environmentId,
        scope: scope
      })
      .then(response => {
        this.addToValues(this, response.data.Variables);
      })
      .catch(error => {
        console.log(error.message);
        this.props.handleNotification('general_fail', 'error');
      });
  }

  getVariables(chartName, chartVersion) {
    this.props.handleLoading(true);
    axios
      .post(TENKAI_API_URL + '/getChartVariables', { chartName, chartVersion })
      .then(response => {
        if (response.data.istio != null) {
          this.setState({
            defaultApiPath: response.data.istio.virtualservices.apiPath,
            injectIstioCar: response.data.istio.enabled,
            enableVirtualService: response.data.istio.virtualservices.enabled
          });
        }

        if (response.data.image !== undefined) {
          this.setState({
            containerImage: response.data.image.repository,
            containerTag: response.data.image.tag
          });
        }

        if (response.data.app != null) {
          this.setState({ variables: response.data.app });
        } else {
          this.setState({ variables: [] });
        }

        const scope = this.props.configMapName;
        const environmentId = parseInt(this.props.envId);

        axios
          .post(TENKAI_API_URL + '/listVariables', {
            environmentId: environmentId,
            scope: scope
          })
          .then(response => {
            this.addToValues(this, response.data.Variables);
            this.props.handleLoading(false);
          })
          .catch(error => {
            this.props.handleLoading(false);
            console.log(error.message);
            this.props.handleNotification('general_fail', 'error');
          });
      })
      .catch(error => {
        this.props.handleLoading(false);
        console.log(error.message);
        this.props.handleNotification('general_fail', 'error');
      });
  }

  getRootName(name) {
    let i = name.indexOf('[');
    return name.substring(0, i);
  }

  fillImageFields(self, variables) {
    variables.forEach((value, index, array) => {
      switch (value.name) {
        case 'image.repository':
          this.setState({ containerImage: value.value });
          break;
        case 'image.tag':
          this.setState({ containerTag: value.value });
          break;
        default:
          break;
      }
    });
  }

  fillIstioFields(self, variables) {
    variables.forEach((value, index, array) => {
      switch (value.name) {
        case 'istio.enabled':
          this.setState({
            injectIstioCar: value.value === 'true' ? true : false
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

  addToValues(self, variables) {
    let dynamicEntries = new Map();
    let valuesMap = new Map();

    variables.forEach((value, index, array) => {
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
      for (let x = 0; x < dynamicEntries[key] / 2 - 1; x++) {
        self.addDynamicVariableClick(key);
      }
      return null;
    });

    this.setState({
      values: valuesMap
    });
  }

  handleConfigMapNameChange = event => {
    const value = event.target.value;
    this.setState({ configMapNameChange: value });
  };

  isValid(key) {
    if (this.hasInvalidVar(key)) {
      return 'form-control is-invalid';
    }
    return '';
  }

  hasInvalidVar(key) {
    return !!this.state.invalidVariables && !!this.state.invalidVariables[key];
  }

  getInvalidMsg(name, ruleType) {
    const v = this.state.invalidVariables[name].find(
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

  render() {
    const items = Object.keys(this.state.variables).map(key => {
      const value = this.state.values[key] || '';
      const keyValue = '' + this.state.variables[key];

      const tooltip = <Tooltip id="tooltip">{keyValue}</Tooltip>;

      return (
        <tr key={key}>
          <td>{key}</td>
          <td>
            <OverlayTrigger
              placement="bottom"
              overlay={tooltip}
              delayShow={300}
              delayHide={150}
            >
              <input
                disabled={
                  !this.props.hasEnvironmentPolicy(ACTION_SAVE_VARIABLES)
                }
                name={key}
                value={value}
                onChange={this.onInputChange}
                type="text"
                style={{ width: '100%' }}
                className={this.isValid(key)}
              />
            </OverlayTrigger>
            {this.hasInvalidVar(key) &&
              this.state.invalidVariables[key].map(k => {
                return (
                  <div key={k} className="invalid-feedback">
                    {this.getInvalidMsg(k.name, k.ruleType)}
                  </div>
                );
              })}
          </td>
        </tr>
      );
    });

    return (
      <div>
        <div>
          <h4>Config Map</h4>
          <form>
            <FormGroup>
              <FormInputs
                ncols={['col-md-6']}
                properties={[
                  {
                    name: 'configMapName',
                    label: 'Config Map Name',
                    type: 'text',
                    bsPrefix: 'form-control',
                    value: this.props.configMapName,
                    onChange: this.handleConfigMapNameChange
                  }
                ]}
              />
            </FormGroup>
          </form>
        </div>

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
      </div>
    );
  }
}

export default ConfigMap;
