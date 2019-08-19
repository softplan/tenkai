import React, { Component } from "react";

import {
    PanelGroup, Panel, Row, Col, FormGroup
} from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios';
import TENKAI_API_URL from 'env.js';


class Traffic extends Component {

    state = {
        serviceName: "",
        headerName: "",
        headerValue: "",
        headerReleaseName: "",
        defaultReleaseName: "",
        handleApiPathChange: "",
        apiPath:"",
        domain: "",
        releases: new Map(),
        releaseCount: -1, 
    }

    addRelease() {
        this.setState({releaseCount: this.state.releaseCount+1}, () => {
            let releases = this.state.releases;
            releases[this.state.releaseCount] = {name:"", weight:0};
            this.setState({releases: releases});
        });
    }
    
    handleDomainChange(event) {
        let value = event.target.value;
        this.setState({domain: value});
    }

    handleApiPathChange(event) {
        let value = event.target.value;
        this.setState({apiPath: value});
    }

    handleDefaultReleaseNameChange(event) {
        let value = event.target.value;
        this.setState({defaultReleaseName: value});
    }

    handleHeaderReleaseNameChange(event) {
        let value = event.target.value;
        this.setState({headerReleaseName: value});
    }

    handleHeaderNameChange(event) {
        let value = event.target.value;
        this.setState({headerName: value});
    }

    handleServiceNameChange(event) {
        let value = event.target.value;
        this.setState({serviceName: value});
    }

    handleHeaderValueChange(event) {
        let value = event.target.value;
        this.setState({headerValue: value});

    }

    handleReleaseNameChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        let weight = this.state.releases[name].weight;

        this.setState({
            releases: {
                ...this.state.releases,
                [name]: {name:value, weight:weight}
            }
        });
    }

    handleWeightChanged(event) {

        let name = event.target.name;
        let value = 0;

        if (event.target.value !== "") {
             value = parseInt(event.target.value, 10);
        }

        let releaseName = this.state.releases[name].name;
        this.setState({
            releases: {
                ...this.state.releases,
                [name]: {name:releaseName, weight:value}
            }
        });
    
    }

    async applyByWeight() {

        let data = {};
        data.environmentId = this.props.selectedEnvironment.value;
        data.domain = this.state.domain;
        data.contextPath = this.state.apiPath;
        data.serviceName = this.state.serviceName;
        data.headerName = "";
        data.headerValue = "";
        data.headerReleaseName = "";
        data.defaultReleaseName = "";
        data.releases = [];

        let list = this.state.releases;

        await Object.keys(list).forEach(function(key) {
            let value = list[key];
            data.releases.push(value);
        });        

        this.props.handleLoading(true);
        axios.post(TENKAI_API_URL + "/deployTrafficRule", data)
            .then(res => {
                this.props.handleLoading(false);
                this.props.handleNotification("deployment_ok", "success");
            }).catch(error => {
                this.props.handleLoading(false);
                console.log(error.message);
                this.props.handleNotification("general_fail", "error");
            });        


    }

    applyByHeader() {

        let data = {};
        data.environmentId = this.props.selectedEnvironment.value;
        data.serviceName = this.state.serviceName;
        data.domain = this.state.domain;
        data.contextPath = this.state.apiPath;
        data.headerName = this.state.headerName;
        data.headerValue = this.state.headerValue;
        data.headerReleaseName = this.state.headerReleaseName;
        data.defaultReleaseName = this.state.defaultReleaseName;

        this.props.handleLoading(true);
        axios.post(TENKAI_API_URL + "/deployTrafficRule", data)
            .then(res => {
                this.props.handleLoading(false);
                this.props.handleNotification("deployment_ok", "success");
            }).catch(error => {
                console.log(error.message);
                this.props.handleLoading(false);
                this.props.handleNotification("general_fail", "error");
            });
    }

    render() {

        const releases =  Object.keys(this.state.releases).map((item, index) => {

            return(
                
                <FormInputs key={index}
                ncols={["col-md-4", "col-md-4"]}
                properties={[
                    {
                        name: index,
                        label: "Release",
                        type: "text",
                        bsClass: "form-control",
                        value: this.state.releases[index].name,
                        onChange: this.handleReleaseNameChange.bind(this)
                    },
                    {
                        name: index,
                        label: "Weight",
                        type: "text",
                        bsClass: "form-control",
                        value: this.state.releases[index].weight,
                        onChange: this.handleWeightChanged.bind(this)
                    }
                ]}/>

            );

        });    

        return (
            <div className="content">
                <Row>
                    <Col md={12}>
                        <Card
                            title="Traffic Management"
                            content={
                                <div>
                                    <FormGroup>
                                        <FormInputs
                                            ncols={["col-md-6", "col-md-4"]}
                                            properties={[
                                                {
                                                    name: "domain",
                                                    label: "DOMAIN",
                                                    type: "text",
                                                    placeholder: "Internal or External DOMAIN",
                                                    bsClass: "form-control",
                                                    value: this.state.domain,
                                                    onChange: this.handleDomainChange.bind(this)
                                                },
                                                {
                                                    name: "apiPath",
                                                    label: "Context Path",
                                                    type: "text",
                                                    placeholder: "/xpto",
                                                    bsClass: "form-control",
                                                    value: this.state.apiPath,
                                                    onChange: this.handleApiPathChange.bind(this)
                                                }

                                            ]}
                                        />
                                    </FormGroup>


                                    <FormGroup>
                                        <FormInputs
                                            ncols={["col-md-4"]}
                                            properties={[
                                                {
                                                    name: "serviceName",
                                                    label: "K8S Service Name",
                                                    type: "text",
                                                    bsClass: "form-control",
                                                    value: this.state.serviceName,
                                                    onChange: this.handleServiceNameChange.bind(this)
                                                }
                                            ]}
                                        />
                                    </FormGroup>


                                    <PanelGroup accordion id="accordion-example">
                                        <Panel eventKey="1">
                                            <Panel.Heading>
                                                <Panel.Title toggle>by Header</Panel.Title>
                                            </Panel.Heading>
                                            <Panel.Body collapsible>
                                            <FormGroup>
                                                <FormInputs
                                                    ncols={["col-md-5", "col-md-5"]}
                                                    properties={[
                                                        {
                                                            name: "headerName",
                                                            label: "Header Name",
                                                            type: "text",
                                                            bsClass: "form-control",
                                                            value: this.state.headerName,
                                                            onChange: this.handleHeaderNameChange.bind(this)
                                                        },
                                                        {
                                                            name: "headerValue",
                                                            label: "Header Value",
                                                            type: "text",
                                                            bsClass: "form-control",
                                                            value: this.state.headerValue,
                                                            onChange: this.handleHeaderValueChange.bind(this)
                                                        },

                                                    ]}/>
                                            </FormGroup>

                                            <FormGroup>
                                                <FormInputs
                                                    ncols={["col-md-4"]}
                                                    properties={[
                                                        {
                                                            name: "headerReleaseName",
                                                            label: "Header Release Name",
                                                            type: "text",
                                                            bsClass: "form-control",
                                                            value: this.state.headerReleaseName,
                                                            onChange: this.handleHeaderReleaseNameChange.bind(this)
                                                        }
                                                    ]}/>
                                            </FormGroup>                 

                                            <FormGroup>
                                                <FormInputs
                                                    ncols={["col-md-4"]}
                                                    properties={[
                                                        {
                                                            name: "defaultReleaseName",
                                                            label: "Default Release Name",
                                                            type: "text",
                                                            bsClass: "form-control",
                                                            value: this.state.dafaultReleaseName,
                                                            onChange: this.handleDefaultReleaseNameChange.bind(this)
                                                        }
                                                    ]}/>
                                            </FormGroup>  



                                            <Button className="btn btn-info pull-right btn-fill" onClick={this.applyByHeader.bind(this)}>
                                                <i className="pe-7s-box2"/>{" "}Apply
                                            </Button>

                                            </Panel.Body>
                                        </Panel>
                                        <Panel eventKey="2">

                                            <Panel.Heading>
                                                <Panel.Title toggle>by Weight</Panel.Title>
                                            </Panel.Heading>

                                            <Panel.Body collapsible>
                                                
                                                <Row>
                                                    <Col md={10}>
                                                        <FormGroup>
                                                            {releases}
                                                        </FormGroup>
                                                        <Button bsStyle="info" onClick={this.addRelease.bind(this)}>
                                                            Add Release
                                                        </Button>
                                                    </Col>          
                                                </Row>

                                                <Button className="btn btn-info pull-right btn-fill" onClick={this.applyByWeight.bind(this)}>
                                                    <i className="pe-7s-box2"/>{" "}Apply
                                                </Button>

                                            </Panel.Body>
                                        </Panel>
                                    </PanelGroup>
                                </div>
                            } />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Traffic;
