import React, { Component } from "react";
import {
    Grid,
    Row,
    Col, InputGroup,
    FormControl, Table
} from "react-bootstrap";
import queryString from 'query-string';
import axios from 'axios';
import TENKAI_API_URL from 'env.js';

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

import { VariablesForm } from "components/Environments/VariablesForm.jsx";


class Variables extends Component {

    state = {
        item: {},
        showInsertUpdateForm: false,
        variablesResult: { Variables: [] },
        environmentName: "",
        locationSearch: ""
    }

    componentDidMount() {
        const environmentName = this.props.location.state.item.name;
        const locationSearch = this.props.location.search;
        this.setState({environmentName: environmentName, locationSearch: locationSearch},
        () => {
            this.getScopedVariables();
        });
    }

    getScopedVariables() {
        const values = queryString.parse(this.state.locationSearch);
        axios.get(TENKAI_API_URL + '/variables/' + values.id)
            .then(response => this.setState({ variablesResult: response.data }))
            .catch(error => {
                console.log(error.message);
                this.props.handleNotification("general_fail", "error");
            });
    }

    handleNewClick(e) {
        this.setState({ showInsertUpdateForm: true });
    }

    handleCancelClick(e) {
        this.setState(() => ({
            showInsertUpdateForm: true,
            editItem: {},
            editMode: false
        }));
    }

    onSaveClick(data) {
        if (this.state.editMode) {
            console.log("edit")
            this.save(data, '/variables/edit')
        } else {
            console.log("new")
            this.save(data, '/variables')
        }
    }

    save(data, uri) {
        const values = queryString.parse(this.state.locationSearch);
        data.environmentId = parseInt(values.id);
        axios.post(TENKAI_API_URL + uri, { data })
          .then(res => {
            if (this.state.editMode) {
                this.getScopedVariables();
            } else {
                this.setState({variablesResult: {Variables: [...this.state.variablesResult.Variables, data]}});
            }
         }).catch(error => {
            console.log(error.message);
            this.props.handleNotification("general_fail", "error");
        });

        this.setState({ showInsertUpdateForm: false });
    }      

    navigateToEditEnvironment(item) {
        this.setState(() => ({
            showInsertUpdateForm: true,
            editItem: item,
            editMode: true
        }));
    }

    onDelete(item) {
        axios.delete(TENKAI_API_URL + "/variables/delete/" + item.ID).then(this.getScopedVariables()).catch(error => {
            console.log(error.message);
            this.props.handleNotification("general_fail", "error");
        });
    }

    render() {

        const items = this.state.variablesResult.Variables.map((item, key) =>

            <tr key={key}>
                <td>{item.scope}</td>
                <td>{item.name}</td>
                <td>{item.value}</td>
                <td>{item.description}</td>
                <td><a href="#" onClick={this.navigateToEditEnvironment.bind(this, item)}><i className="pe-7s-edit"/></a></td>
                <td><a href="#" onClick={this.onDelete.bind(this, item)}><i className="pe-7s-trash"/></a></td>
            </tr>

        );

        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title=""
                                content={
                                    <form>

                                        <h2>{this.state.environmentName}</h2>

                                        <div className="col-md-8" style={{ padding: '8px 0px' }}>
                                            <InputGroup>
                                                <FormControl
                                                    placeholder="Search variables using any field" aria-label="Search variables using any field"
                                                />
                                                <InputGroup.Button>
                                                    <Button variant="outline-secondary" >Search</Button>
                                                </InputGroup.Button>
                                            </InputGroup>

                                        </div>
                                        <Button className="pull-right" variant="primary" onClick={this.handleNewClick.bind(this)}>New Variable</Button>
                                        <div className="clearfix" />
                                        
                                    </form>

                                }
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            {this.state.showInsertUpdateForm ?
                                <VariablesForm saveClick={this.onSaveClick.bind(this)} editItem={this.state.editItem} cancelClick={this.handleCancelClick.bind(this)} /> : null
                            }
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <Card
                                title="Variables x"
                                content={
                                    <form>
                                        <Row>
                                            <Table bordered hover size="sm">
                                                <thead>
                                                    <tr>
                                                        <th>Scope</th>
                                                        <th>Variable Name</th>
                                                        <th>Value</th>
                                                        <th>Description</th>
                                                        <th>Edit</th>
                                                        <th>Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {items}
                                                </tbody>
                                            </Table>
                                        </Row>
                                    </form>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Variables;
