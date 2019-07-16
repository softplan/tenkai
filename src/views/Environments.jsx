import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    FormControl, Table, FormGroup, ControlLabel
} from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import { Card } from "components/Card/Card.jsx";
import CButton from "components/CustomButton/CustomButton.jsx";
import EnvironmentForm from "components/Environments/EnvironmentForm.jsx";
import SimpleModal from 'components/Modal/SimpleModal.jsx'
import axios from 'axios';
import TENKAI_API_URL from 'env.js';

class Environments extends Component {

    state = {
        showInsertUpdateForm: false,
        envResult: { Envs: [] },
        inputFilter: "",
        showConfirmDeleteModal: false,
        itemToDelete: {}, 
    }

    componentDidMount() {
        this.getEnvironments()
    }

    handleConfirmDeleteModalClose() {
        this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
    }

    handleConfirmDeleteModalShow() {
        this.setState({ showConfirmDeleteModal: true });
    }

    onChangeFilterHandler(e) {
        this.setState({
            inputFilter: e.target.value,
        })
    }

    getEnvironments() {
        axios.get(TENKAI_API_URL + '/environments')
            .then(response => this.setState({ envResult: response.data }))
            .catch(error => {
                console.log(error.message);
                this.props.handleNotification("general_fail", "error");
            });
    }

    navigateToEnvironmentVariables(id, group, name) {
        console.log("id: " + JSON.stringify(id));
        this.props.history.push({
            pathname: "/admin/environments-envvars",
            search: "?id=" + id,
            state: { item: { group: group, name: name } }
        });
    }

    navigateToEditEnvironment(item) {
    
        this.setState(() => ({
            showInsertUpdateForm: true,
            editItem: item,
            editMode: true
        }));
    }

    handleNewEnvironmentClick(e) {
        this.setState(() => ({
            showInsertUpdateForm: true,
            editItem: {},
            editMode: false
        }));
    }

    handleCancelEnvironmentClick(e) {
        this.setState(() => ({
            showInsertUpdateForm: false,
            editItem: {},
            editMode: false
        }));
    }

    onSaveClick(data) {
        if (this.state.editMode) {
            console.log("edit")
            this.save(data, '/environments/edit')
        } else {
            console.log("new")
            this.save(data, '/environments')
        }
    }

    save(data, uri) {
        axios.post(TENKAI_API_URL + uri, { data })
            .then(res => {
                this.setState({ envResult: { Envs: [...this.state.envResult.Envs, data] } });
                this.getEnvironments();
            }).catch(error => {
                console.log(error.message);
                this.props.handleNotification("general_fail", "error");
            });
        this.setState(() => ({
            showInsertUpdateForm: false,
            editItem: {},
            editMode: false
        }));
    }

    onDelete(item) {
        this.setState({itemToDelete: item}, () => {this.handleConfirmDeleteModalShow()});
    }

    handleConfirmDelete() {
        if (this.state.itemToDelete !== undefined) {
            axios.delete(TENKAI_API_URL + "/environments/delete/" + this.state.itemToDelete.ID)
            .then(res => {
                this.getEnvironments();
            }).catch(error => {
                console.log(error.message);
                this.props.handleNotification("general_fail", "error");
            });
        }
        this.setState({showConfirmDeleteModal: false, itemToDelete: {}});
    }

    render() {

        const items = this.state.envResult.Envs
            .filter(d => this.state.inputFilter === '' || d.name.includes(this.state.inputFilter)).map((item, key) =>
                <tr key={key}>
                    <td>{item.ID}</td>
                    <td>{item.group}</td>
                    <td>{item.name}</td>
                    <td>{item.cluster_uri}</td>
                    <td>{item.namespace}</td>
                    <td><Button className="link-button"
                         onClick={this.navigateToEditEnvironment.bind(this, item)}><i className="pe-7s-edit"/></Button></td>
                    <td><Button className="link-button" 
                        onClick={this.onDelete.bind(this, item)}><i className="pe-7s-trash" /></Button></td> 
                    <td><Button className="link-button" 
                        onClick={this.navigateToEnvironmentVariables.bind(this, item.ID, item.group, item.name)}><i className="pe-7s-plugin" /></Button></td> 
                </tr>
            );

        return (

            <div className="content">

                <SimpleModal 
                    showConfirmDeleteModal={this.state.showConfirmDeleteModal}
                    handleConfirmDeleteModalClose={this.handleConfirmDeleteModalClose.bind(this)}
                    title="Confirm" subTitle="Delete environment" message="Are you sure you want to delete this environment?"
                    handleConfirmDelete={this.handleConfirmDelete.bind(this)}>  
                </SimpleModal>

                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title=""
                                content={
                                    <form>
                                        <CButton className="pull-right" variant="primary" onClick={this.handleNewEnvironmentClick.bind(this)} >New Environment</CButton>
                                        <div className="clearfix" />
                                    </form>

                                }
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            {this.state.showInsertUpdateForm ?
                                <EnvironmentForm editMode={this.state.editMode} editItem={this.state.editItem} saveClick={this.onSaveClick.bind(this)} cancelClick={this.handleCancelEnvironmentClick.bind(this)} /> : null
                            }
                        </Col>
                    </Row>


                    <Row>
                        <Col md={12}>
                            <Card
                                title="Environments"
                                content={
                                    <form>

                                        <div className="col-md-8">

                                            <FormGroup>
                                                <ControlLabel>Environment Search</ControlLabel>
                                                <FormControl
                                                    value={this.state.inputFilter}
                                                    onChange={this.onChangeFilterHandler.bind(this)}
                                                    style={{ width: '100%' }} type="text"
                                                    placeholder="Search using any field"
                                                    aria-label="Search using any field">
                                                </FormControl>
                                            </FormGroup>

                                        </div>


                                        <div>
                                            <Table bordered hover size="sm">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Group</th>
                                                        <th>Environment Name</th>
                                                        <th>Cluster URI</th>
                                                        <th>Namespace</th>
                                                        <th>Edit</th>
                                                        <th>Delete</th>
                                                        <th>Variables</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {items}
                                                </tbody>
                                            </Table>
                                        </div>
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


export default Environments;
