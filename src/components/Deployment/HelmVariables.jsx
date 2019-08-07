import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";
import {
    Row,
    Col,
    Table, FormGroup
} from "react-bootstrap";
import axios from 'axios';
import ArrayVariable from "components/Deployment/ArrayVariable.jsx"
import IstioVariable from "./IstioVariable";
import TENKAI_API_URL from 'env.js';
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { ConfigMap } from "components/Deployment/ConfigMap.jsx";

export class HelmVariables extends Component {

    state = {
        chartName: "",
        ChartVersion: "",
        variables: {},
        values: {},
        defaultApiPath: "",
        injectIstioCar: true,
        enableVirtualService: true,
        containerImage: "",
        containerTag: "",
        hosts: {},
        hostCount: 0,
        configMapChart: "saj6/dotnet-global-variables",
        simpleChart: "saj6/dotnet-global-config",
    }

    constructor(props) {
        super(props);
        this.state.chartName = props.chartName;
        this.state.chartVersion = props.chartVersion;
     }    

    async componentDidMount() {
        this.addHost();
        //await this.getVariables(this.state.chartName, this.state.chartVersion);
    }

    addDynamicVariableClick(variableName) {

        let dbArray = [...this.state.variables[variableName]];

        let item = {}
        if (dbArray.length > 0) {
            for (let element of dbArray.keys()) {
                item = dbArray[element];
            }
        } else {
            item = { name: "", value: "" };
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
    }

    save(callbackFunction) {

        const scope = this.state.chartName;
        const environmentId = parseInt(this.props.envId);
        let payload = { data: [] };

        const elements = this.state.values;

        Object.keys(this.state.values).map(function (key, index) {
            payload.data.push({ scope: scope, name: key, value: elements[key], environmentId: environmentId });
            return null;
        });

        payload.data.push({ scope: scope, name: "istio.enabled", value: this.state.injectIstioCar ? "true" : "false", environmentId: environmentId });
        payload.data.push({ scope: scope, name: "istio.virtualservices.enabled", value: this.state.enableVirtualService ? "true" : "false", environmentId: environmentId });
        payload.data.push({ scope: scope, name: "istio.virtualservices.apiPath", value: this.state.defaultApiPath, environmentId: environmentId });
        payload.data.push({ scope: scope, name: "image.repository", value: this.state.containerImage, environmentId: environmentId });
        payload.data.push({ scope: scope, name: "image.tag", value: this.state.containerTag, environmentId: environmentId });

        const hosts = this.state.hosts;
        Object.keys(hosts).map(function (key, index) {
            payload.data.push({ scope: scope, name: key, value: hosts[key], environmentId: environmentId });
            return null;
        });

        let data = payload.data;

        axios.post(TENKAI_API_URL + '/saveVariableValues', { data }).then(res => {

            if (this.refs.hConfigMap !== undefined) {
                this.refs.hConfigMap.save((data) => { 
                    let list = [];
                    //Main
                    let installPayload = {};
                    const environmentId = parseInt(this.props.envId);
                    var n = scope.indexOf("/");
                    installPayload.name = scope.substring(n + 1);
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
                var n = scope.indexOf("/");
                installPayload.name = scope.substring(n + 1);
                installPayload.chart = scope;
                installPayload.environmentId = environmentId;
                list.push(installPayload);
                callbackFunction(list);
            }

        }).catch(error => {
            this.props.handleNotification("general_fail", "error");
            console.log("Error saveVariableValues: " + error.message);
        });

    }


    async getVariables(chartName, chartVersion)  {
        
        
        await axios.post(TENKAI_API_URL + '/getChartVariables', { chartName, chartVersion })
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
                        containerTag: response.data.image.tag,
                    });
                }

                if (response.data.app != null) {
                    this.setState({ variables: response.data.app });
                } else {
                    this.setState({ variables: [] });
                }

                const scope = this.state.chartName;
                const environmentId = parseInt(this.props.envId);

                axios.post(TENKAI_API_URL + '/listVariables', { environmentId: environmentId, scope: scope })
                    .then(response => {
                        this.addToValues(this, response.data.Variables);
                        this.fillIstioFields(this, response.data.Variables);
                        this.fillImageFields(this, response.data.Variables);
                    }).catch(error => {
                        console.log(error.message);
                        this.props.handleNotification("general_fail", "error");
                    });

            }).catch(error => {
                console.log("Error here: " + JSON.stringify(error));
                this.props.handleNotification("general_fail", "error");
            });
    }

    getRootName(name) {
        let i = name.indexOf("[");
        return name.substring(0, i);
    }

    fillImageFields(self, variables) {
        variables.forEach((value, index, array) => {

            switch (value.name) {
                case "image.repository":
                    this.setState({ containerImage: value.value })
                    break;
                case "image.tag":
                    this.setState({ containerTag: value.value })
                    break;
                default:
                    break;
            }
        });
    }

    fillIstioFields(self, variables) {
        variables.forEach((value, index, array) => {

            switch (value.name) {
                case "istio.enabled":
                    this.setState({ injectIstioCar: value.value === "true" ? true : false })
                    break;
                case "istio.virtualservices.enabled":
                    this.setState({ enableVirtualService: value.value === "true" ? true : false })
                    break;
                case "istio.virtualservices.apiPath":
                    this.setState({ defaultApiPath: value.value })
                    break;
                default:
                    if (value.name.indexOf("istio.virtualservices.hosts[") > -1) {
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
            if (value.name.indexOf("].") > -1) {

                if (dynamicEntries[this.getRootName(value.name)] !== undefined) {
                    dynamicEntries[this.getRootName(value.name)]++;
                } else {
                    dynamicEntries[this.getRootName(value.name)] = 1;
                }
            }
        });

        Object.keys(dynamicEntries).map(function (key) {
            for (let x = 0; x < (dynamicEntries[key] / 2) - 1; x++) {
                self.addDynamicVariableClick(key);
            }
            return null
        });

        this.setState({
            values: valuesMap
        });
    }

    handleContainerImageChange = event => {
        const value = event.target.value;
        this.setState({ containerImage: value });
    }

    handleContainerTagChange = event => {
        const value = event.target.value;
        this.setState({ containerTag: value });
    }

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
        let name = "istio.virtualservices.hosts[" + this.state.hostCount + "]";
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

    getConfigMap(value) {
        let configMapName = value + "-global-configmap";
        var n = configMapName.indexOf("/");
        configMapName = configMapName.substring(n + 1);
        return configMapName
    }


    render() {
        
        let configMapName = this.getConfigMap(this.state.chartName);

        const items = Object.keys(this.state.variables).map(key => {


            if (typeof this.state.variables[key] == 'object') {
                return (
                    <ArrayVariable key={key} name={key}
                        variables={this.state.variables[key]}
                        values={this.state.values}
                        onCreateDynamicVariable={this.addDynamicVariableClick.bind(this)}
                        onInputChange={this.onInputChangeFromChild.bind(this)} />
                )
            } else {

                const value = this.state.values[key] || "";
                const keyValue = "" + this.state.variables[key];

                return (
                    <tr key={key}>
                        <td>{key}</td>
                        <td>{keyValue}</td>
                        <td><input name={key} value={value}
                            onChange={this.onInputChange}
                            type="text" style={{ width: "100%" }} /></td>
                    </tr>
                );
            }
        });


        return (

            

            <Row>
                <Col md={12}>
                    <Card
                        title={this.state.chartName}
                        content={
                            <div>
                                {this.state.chartName !== this.state.simpleChart ? 
                                <div>
                                    <form>
                                        <FormGroup>
                                            <FormInputs
                                                ncols={["col-md-6", "col-md-2"]}
                                                properties={[
                                                    {
                                                        name: "image",
                                                        label: "Container image",
                                                        type: "text",
                                                        bsClass: "form-control",
                                                        value: this.state.containerImage,
                                                        onChange: this.handleContainerImageChange
                                                    },
                                                    {
                                                        name: "tag",
                                                        label: "Container Tag",
                                                        type: "text",
                                                        bsClass: "form-control",
                                                        value: this.state.containerTag,
                                                        onChange: this.handleContainerTagChange
                                                    },
                                                ]}
                                            />
                                        </FormGroup>
                                    </form>
                                </div>
                                : <div></div> }


                                {this.state.chartName !== this.state.simpleChart ? 
                                <div>
                                    <IstioVariable
                                        defaultApiPath={this.state.defaultApiPath}
                                        injectIstioCar={this.state.injectIstioCar}
                                        enableVirtualService={this.state.enableVirtualService}
                                        hosts={this.state.hosts}
                                        onAddHost={this.addHost.bind(this)}
                                        onApiGatewayPathChange={this.onApiGatewayPathChange.bind(this)}
                                        onInjectIstioCar={this.handleOnInjectIstioCar.bind(this)}
                                        onEnableVirtualService={this.handleEnableVirtualService.bind(this)}
                                        onHostChange={this.onHostChange.bind(this)}
                                    />
                                </div>
                                : <div></div> }

                                <hr />


                                <div>
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "10%" }}>Variable</th>
                                                <th style={{ width: "40%" }}>Chart Default Value</th>
                                                <th style={{ width: "40%" }}>Environment Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items}
                                        </tbody>
                                    </Table>
                                </div>
                                
                                <hr />

                                {this.state.chartName !== this.state.simpleChart ? 
                                <ConfigMap handleLoading={this.props.handleLoading} 
                                    handleNotification={this.props.handleNotification} 
                                    key="ConfigMap" chartName={this.state.configMapChart}  
                                    chartVersion={this.state.configMapChartVersion}
                                    ref="hConfigMap" configMapName={configMapName}
                                    envId={this.props.envId}/>    
                                : <div></div> }

                            </div>

                        }
                    />
                </Col>
            </Row>

        );
    }
}

export default HelmVariables;
