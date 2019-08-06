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
import UserForm from "components/Users/UserForm.jsx";
import SimpleModal from 'components/Modal/SimpleModal.jsx'
import axios from 'axios';
import TENKAI_API_URL from 'env.js';
import { saveUsers  } from 'client-api/apicall.jsx';


class Users extends Component {

    state = {
        showInsertUpdateForm: false,
        list: [],
        inputFilter: "",
        showConfirmDeleteModal: false,
        itemToDelete: {}, 
    }

    componentDidMount() {
        this.getList()
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

    getList() {
       axios.get(TENKAI_API_URL + '/users')
            .then(response => this.setState({ list: response.data.users }))
            .catch(error => {
                console.log(error.message);
                this.props.handleNotification("general_fail", "error");
            });
       
    }

    handleNewClick(e) {
        this.setState(() => ({
            showInsertUpdateForm: true,
            editItem: {},
            editMode: false
        }));
    }

    handleCancelClick(e) {
        this.setState(() => ({
            showInsertUpdateForm: false,
            editItem: {},
            editMode: false
        }));
    }

    onSaveClick(data) {
        let user = {};
        user.email = data.email;
        user.environments = [];
        for (let x = 0; x < data.checkedEnvs.length; x++) {
            let value = parseInt(data.checkedEnvs[x]);
            user.environments.push({ID: value});
        }
        saveUsers(user, this, function(self) {
            self.getList();
        });
    }

    onSave(item) {
        this.setState(() => ({
            showInsertUpdateForm: true,
            editItem: item,
            editMode: true
        }));
    }

  
    onDelete(item) {
        this.setState({itemToDelete: item}, () => {this.handleConfirmDeleteModalShow()});
    }

    handleConfirmDelete() {
        if (this.state.itemToDelete !== undefined) {
            axios.delete(TENKAI_API_URL + "/users/" + this.state.itemToDelete.ID)
            .then(res => {
                this.getList();
            }).catch(error => {
                console.log(error.message);
                this.props.handleNotification("general_fail", "error");
            });
        }
        this.setState({showConfirmDeleteModal: false, itemToDelete: {}});
    }

   

    render() {

        const items = this.state.list
            .filter(d => this.state.inputFilter === '' || d.email.includes(this.state.inputFilter)).map((item, key) =>
                <tr key={key}>
                    <td>{item.ID}</td>
                    <td>{item.email}</td>
                    <td><Button className="link-button"
                         onClick={this.onSave.bind(this, item)}><i className="pe-7s-edit"/></Button></td>
                    <td><Button className="link-button" 
                        onClick={this.onDelete.bind(this, item)}><i className="pe-7s-trash" /></Button></td> 
                </tr>
            );

        return (

            <div className="content">

                <SimpleModal 
                    showConfirmDeleteModal={this.state.showConfirmDeleteModal}
                    handleConfirmDeleteModalClose={this.handleConfirmDeleteModalClose.bind(this)}
                    title="Confirm" subTitle="Delete user" message="Are you sure you want to delete this user?"
                    handleConfirmDelete={this.handleConfirmDelete.bind(this)}>  
                </SimpleModal>

                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title=""
                                content={
                                    <form>
                                        <CButton className="pull-right" variant="primary" onClick={this.handleNewClick.bind(this)} >New User</CButton>
                                        <div className="clearfix" />
                                    </form>

                                }
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            {this.state.showInsertUpdateForm ?
                                <UserForm editMode={this.state.editMode} editItem={this.state.editItem} saveClick={this.onSaveClick.bind(this)} cancelClick={this.handleCancelClick.bind(this)} /> : null
                            }
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <Card
                                title="Users"
                                content={
                                    <form>

                                        <div className="col-md-8">

                                            <FormGroup>
                                                <ControlLabel>User Search</ControlLabel>
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
                                                        <th>Email</th>
                                                        <th>Edit</th>
                                                        <th>Delete</th>
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

export default Users;
