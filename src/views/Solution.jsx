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
import SolutionForm from "components/Solution/SolutionForm.jsx";
import SimpleModal from 'components/Modal/SimpleModal.jsx'
import axios from 'axios';
import TENKAI_API_URL from 'env.js';

class Solution extends Component {

    state = {
        showInsertUpdateForm: false,
        list:  [],
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
        axios.get(TENKAI_API_URL + '/solutions')
            .then(response => this.setState({ list: response.data.list }))
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
        if (this.state.editMode) {
            console.log("edit")
            this.save(data, '/solutions/edit')
        } else {
            console.log("new")
            this.save(data, '/solutions')
        }
    }

    onSave(item) {
        this.setState(() => ({
            showInsertUpdateForm: true,
            editItem: item,
            editMode: true
        }));
    }

    save(data, uri) {
        
        axios.post(TENKAI_API_URL + uri, data)
            .then(res => {
                this.setState({ list: [...this.state.list], data });
                this.getList();
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

    onEditDetails(item) {
        this.props.history.push({
            pathname: "/admin/solution-deps",
            search: "?solutionId=" + item.ID
        });
    }

    handleConfirmDelete() {
        if (this.state.itemToDelete !== undefined) {
            axios.delete(TENKAI_API_URL + "/solutions/" + this.state.itemToDelete.ID)
            .then(res => {
                this.getList();
            }).catch(error => {
                console.log(error.message);
                this.props.handleNotification("general_fail", "error");
            });
        }
        this.setState({showConfirmDeleteModal: false, itemToDelete: {}});
    }

    onDeploy(item) {

        this.props.history.push({
            pathname: "/admin/solution-deploy",
            search: "?solutionId=" + item.ID
        });        
    }

    render() {

        const items = this.state.list
            .filter(d => this.state.inputFilter === '' || d.name.includes(this.state.inputFilter)).map((item, key) =>
                <tr key={key}>
                    <td>{item.ID}</td>
                    <td>{item.name}</td>
                    <td>{item.team}</td>
                    <td><Button className="link-button"
                         onClick={this.onSave.bind(this, item)}><i className="pe-7s-edit"/></Button></td>
                    <td><Button className="link-button" 
                        onClick={this.onDelete.bind(this, item)}><i className="pe-7s-trash" /></Button></td> 
                    <td><Button className="link-button" 
                        onClick={this.onEditDetails.bind(this, item)}><i className="pe-7s-album" /></Button></td> 
                    <td><Button className="link-button" 
                        onClick={this.onDeploy.bind(this, item)}><i className="pe-7s-helm" /></Button></td> 

                </tr>
            );

        return (

            <div className="content">

                <SimpleModal 
                    showConfirmDeleteModal={this.state.showConfirmDeleteModal}
                    handleConfirmDeleteModalClose={this.handleConfirmDeleteModalClose.bind(this)}
                    title="Confirm" subTitle="Delete solution" message="Are you sure you want to delete this solution?"
                    handleConfirmDelete={this.handleConfirmDelete.bind(this)}>  
                </SimpleModal>

                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title=""
                                content={
                                    <form>
                                        <CButton className="pull-right" variant="primary" onClick={this.handleNewClick.bind(this)} >New Solution</CButton>
                                        <div className="clearfix" />
                                    </form>

                                }
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            {this.state.showInsertUpdateForm ?
                                <SolutionForm editMode={this.state.editMode} editItem={this.state.editItem} saveClick={this.onSaveClick.bind(this)} cancelClick={this.handleCancelClick.bind(this)} /> : null
                            }
                        </Col>
                    </Row>


                    <Row>
                        <Col md={12}>
                            <Card
                                title="Solutions"
                                content={
                                    <form>

                                        <div className="col-md-8">

                                            <FormGroup>
                                                <ControlLabel>Solution Search</ControlLabel>
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
                                                        <th>Solution Name</th>
                                                        <th>Team</th>
                                                        <th>Edit</th>
                                                        <th>Delete</th>
                                                        <th>Charts</th>
                                                        <th>Deploy</th>
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

export default Solution;
