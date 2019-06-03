import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";
import {
    Row,
    Col,
    Table
} from "react-bootstrap";
import axios from 'axios';
import ArrayVariable from "components/Deployment/ArrayVariable.jsx"
import IstioVariable from "./IstioVariable";

export class HelmVariables extends Component {

    state = {
        variables: {},
        values: {},
        defaultApiPath: "",
        injectIstioCar: true,
        enableVirtualService: true,
        hosts: {}
    }

    componentDidMount() {
        this.getVariables()
        this.addHost("istio.virtualservices.hosts[0]")
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

    save() {

        const scope = this.props.name;
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
        const hosts =  this.state.hosts;
        Object.keys(hosts).map(function (key, index) {
            payload.data.push({ scope: scope, name: key, value: hosts[key], environmentId: environmentId});
            return null;
        });        

        let data = payload.data;

        axios.post('http://localhost:8080/saveVariableValues', { data })
            .then(res => {

                let installPayload = {};
                installPayload.namespace = "master";
                const environmentId = parseInt(this.props.envId);

                var n = scope.indexOf("/");
                installPayload.name = scope.substring(n + 1) + "-" + installPayload.namespace
                installPayload.chart = scope

                let args = []

                Object.keys(this.state.values).map(function (key, index) {
                    args.push({ name: "app." + key, value: elements[key] });
                    return null;
                });

                args.push({ name: "istio.enabled", value: this.state.injectIstioCar ? "true" : "false" });
                args.push({ name: "istio.virtualservices.enabled", value: this.state.enableVirtualService ? "true" : "false" });
                args.push({ name: "istio.virtualservices.apiPath", value: this.state.defaultApiPath });
                const hosts =  this.state.hosts;
                Object.keys(hosts).map(function (key, index) {
                    args.push({ name: key, value: hosts[key]});
                    return null;
                });

                installPayload.arguments = args;
                installPayload.environmentId = environmentId;

                axios.post('http://localhost:8080/install', installPayload).then(function () {
                    console.log('OK -> DEPLOYED');
                    alert("OK - Verifiy with \"kubectl get pods\"");
                });

            });

    }
    

    getVariables() {
        axios.get('http://localhost:8080/getChartVariables/' + this.props.name)
            .then(response => {

                if (response.data.app != null) {
                    this.setState({ variables: response.data.app });
                    this.setState({ defaultApiPath: response.data.istio.virtualservices.apiPath });

                } else {
                    this.setState({ variables: [] });
                }

                const scope = this.props.name;
                const environmentId = parseInt(this.props.envId);

                axios.post('http://localhost:8080/listVariables', { environmentId: environmentId, scope: scope })
                    .then(response => {

                        this.addToValues(this, response.data.Variables);
                        this.fillIstioFields(this, response.data.Variables);

                    }).catch(error => console.log(error.message))

            }).catch(error => console.log(error.message))

    }

    getRootName(name) {
        let i = name.indexOf(".[");
        return name.substring(0, i);
    }

    fillIstioFields(self, variables) {
        variables.forEach((value, index, array) => {

            switch(value.name) {
                case "istio.enabled":
                    this.setState({injectIstioCar: value.value === "true" ? true : false })
                    break;
                case "istio.virtualservices.enabled":
                    this.setState({enableVirtualService: value.value === "true" ? true : false })
                    break;
                case "istio.virtualservices.apiPath":
                    this.setState({defaultApiPath: value.value })
                    break;
                default:
                    if (value.name.indexOf("istio.virtualservices.hosts[") > -1) {
                        console.log(value.name);
                        /*
                        let name = value.name;
                        let value = value.value;

                        console.log(name + "=>" + value);

                        if (this.state.hosts[value.name] !== undefined) {
                            console.log('aqui');
                            this.setState(state => ({
                                hosts: {
                                    ...state.hosts,
                                    [name]: value
                                }
                            }));
                        }
                        */
                    }
                  // code block
              }             
            



        });
    }


    addToValues(self, variables) {

        let dynamicEntries = new Map();
        let valuesMap = new Map();

        variables.forEach((value, index, array) => {
            valuesMap[value.name] = value.value;
            if (value.name.indexOf(".[") > -1) {
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


    onApiGatewayPathChange(newValue) {
        this.setState({defaultApiPath: newValue});
    }    

    handleOnInjectIstioCar(newValue) {
        this.setState({injectIstioCar: newValue});
    }

    handleEnableVirtualService(newValue) {
        this.setState({enableVirtualService: newValue});
    }

    addHost(name) {
        this.onHostChange(name, '');
    }

    onHostChange(name, value) {
        this.setState(state => ({
            hosts: {
                ...state.hosts,
                [name]: value
            }
        }));
    }


    render() {
        const items = Object.keys(this.state.variables).map(key => {
            const value = this.state.values[key] || "";
            if (typeof this.state.variables[key] == 'object') {
                return (
                    <ArrayVariable key={key} name={key}
                        variables={this.state.variables[key]}
                        values={this.state.values}
                        onCreateDynamicVariable={this.addDynamicVariableClick.bind(this)}
                        onInputChange={this.onInputChangeFromChild.bind(this)}/>
                )
            } else {
                return (
                    <tr key={key}>
                        <td>{key}</td>
                        <td>{this.state.variables[key]}</td>
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
                        title={this.props.name}
                        content={
                            <div>
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

                                <hr />
                                <div>
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "20%" }}>Variable</th>
                                                <th style={{ width: "40%" }}>Chart Default Value</th>
                                                <th style={{ width: "40%" }}>Environment Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>

                        }
                    />
                </Col>
            </Row>

        );
    }
}

export default HelmVariables;
