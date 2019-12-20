import React, { Component } from "react";

import {
  CardGroup, Card, Row, Col, FormGroup
} from "react-bootstrap";
import { CardTenkai } from "components/Card/CardTenkai.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export class TrafficPanel extends Component {

    state = {
        serviceName: "",
        headerName: "",
        headerValue: "",
        headerReleaseName: "",
        defaultReleaseName: "",
        handleApiPathChange: "",
        apiPath: "",
        domain: "",
        releases: new Map(),
        releaseCount: -1,
    }

    async componentDidMount() {

        if (this.props.host !== undefined) {
            this.setState({domain: this.props.host});
        }

        if (this.props.apiPath !== undefined) {
            this.setState({apiPath: this.props.apiPath});
        }

        if (this.props.serviceName !== undefined) {
            this.setState({serviceName: this.props.serviceName});
        }

        this.addRelease();

        if (this.props.defaultReleaseName !== undefined) {
            this.setState({defaultReleaseName: this.props.defaultReleaseName});
            await this.addRelease(this.props.defaultReleaseName);
        }

        if (this.props.headerReleaseName !== undefined) {
            this.setState({headerReleaseName: this.props.headerReleaseName});
            await this.addRelease(this.state.headerReleaseName);
        }

    }

    async addRelease(name) {
        let releaseName = name;
        this.setState({ releaseCount: this.state.releaseCount + 1 }, () => {
            let releases = this.state.releases;
            if (releaseName !== undefined) {
                releases[this.state.releaseCount] = { name: releaseName, weight: 0 };
            } else {
                releases[this.state.releaseCount] = { name: "", weight: 0 };
            }
            this.setState({ releases: releases });
        });
    }

    handleDomainChange(event) {
        let value = event.target.value;
        this.setState({ domain: value });
    }

    handleApiPathChange(event) {
        let value = event.target.value;
        this.setState({ apiPath: value });
    }

    handleDefaultReleaseNameChange(event) {
        let value = event.target.value;
        this.setState({ defaultReleaseName: value });
    }

    handleHeaderReleaseNameChange(event) {
        let value = event.target.value;
        this.setState({ headerReleaseName: value });
    }

    handleHeaderNameChange(event) {
        let value = event.target.value;
        this.setState({ headerName: value });
    }

    handleServiceNameChange(event) {
        let value = event.target.value;
        this.setState({ serviceName: value });
    }

    handleHeaderValueChange(event) {
        let value = event.target.value;
        this.setState({ headerValue: value });

    }

    handleReleaseNameChange(event) {
        let name = event.target.name;
        let value = event.target.value;

        let weight = this.state.releases[name].weight;

        this.setState({
            releases: {
                ...this.state.releases,
                [name]: { name: value, weight: weight }
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
                [name]: { name: releaseName, weight: value }
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

        await Object.keys(list).forEach(function (key) {
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

        console.log("applyByHeader()");

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

        const releases = Object.keys(this.state.releases).map((item, index) => {

            return (

                <FormInputs key={index}
                    ncols={["col-md-4", "col-md-4"]}
                    properties={[
                        {
                            name: index,
                            label: "Release",
                            type: "text",
                            bsPrefix: "form-control",
                            value: this.state.releases[index].name,
                            onChange: this.handleReleaseNameChange.bind(this)
                        },
                        {
                            name: index,
                            label: "Weight",
                            type: "text",
                            bsPrefix: "form-control",
                            value: this.state.releases[index].weight,
                            onChange: this.handleWeightChanged.bind(this)
                        }
                    ]} />

            );

        });

        return (
            <div className="content">
                <Row>
                    <Col md={12}>
                        <CardTenkai
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
                                                    bsPrefix: "form-control",
                                                    value: this.state.domain,
                                                    onChange: this.handleDomainChange.bind(this)
                                                },
                                                {
                                                    name: "apiPath",
                                                    label: "Context Path",
                                                    type: "text",
                                                    placeholder: "/xpto",
                                                    bsPrefix: "form-control",
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
                                                    bsPrefix: "form-control",
                                                    value: this.state.serviceName,
                                                    onChange: this.handleServiceNameChange.bind(this)
                                                }
                                            ]}
                                        />
                                    </FormGroup>


                                    <CardGroup accordion="true" id="accordion-example">
                                        <Card eventKey="1">
                                            <Card.Header>
                                                <Card.Title toggle>Canary (by Header)</Card.Title>
                                            </Card.Header>
                                            <Card.Body collapsible>
                                                <FormGroup>
                                                    <FormInputs
                                                        ncols={["col-md-5", "col-md-5"]}
                                                        properties={[
                                                            {
                                                                name: "headerName",
                                                                label: "Header Name",
                                                                type: "text",
                                                                bsPrefix: "form-control",
                                                                value: this.state.headerName,
                                                                onChange: this.handleHeaderNameChange.bind(this)
                                                            },
                                                            {
                                                                name: "headerValue",
                                                                label: "Header Value",
                                                                type: "text",
                                                                bsPrefix: "form-control",
                                                                value: this.state.headerValue,
                                                                onChange: this.handleHeaderValueChange.bind(this)
                                                            },

                                                        ]} />
                                                </FormGroup>

                                                <FormGroup>
                                                    <FormInputs
                                                        ncols={["col-md-4"]}
                                                        properties={[
                                                            {
                                                                name: "headerReleaseName",
                                                                label: "Header Release Name",
                                                                type: "text",
                                                                bsPrefix: "form-control",
                                                                value: this.state.headerReleaseName,
                                                                onChange: this.handleHeaderReleaseNameChange.bind(this)
                                                            }
                                                        ]} />
                                                </FormGroup>

                                                <FormGroup>
                                                    <FormInputs
                                                        ncols={["col-md-4"]}
                                                        properties={[
                                                            {
                                                                name: "defaultReleaseName",
                                                                label: "Default Release Name",
                                                                type: "text",
                                                                bsPrefix: "form-control",
                                                                value: this.state.defaultReleaseName,
                                                                onChange: this.handleDefaultReleaseNameChange.bind(this)
                                                            }
                                                        ]} />
                                                </FormGroup>

                                            </Card.Body>
                                        </Card>
                                        <Card eventKey="2">

                                            <Card.Header>
                                                <Card.Title toggle>Blue/Green (by Weight)</Card.Title>
                                            </Card.Header>

                                            <Card.Body collapsible>

                                                <Row>
                                                    <Col md={10}>
                                                        <FormGroup>
                                                            {releases}
                                                        </FormGroup>
                                                        <Button variant="info" onClick={this.addRelease.bind(this)}>
                                                            Add Release
                                                        </Button>
                                                    </Col>
                                                </Row>

                                            </Card.Body>
                                        </Card>
                                    </CardGroup>
                                </div>
                            } />
                    </Col>
                </Row>
            </div>
        );
    }




}

export default TrafficPanel;
