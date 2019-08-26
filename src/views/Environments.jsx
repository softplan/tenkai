import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    FormControl, FormGroup, ControlLabel
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import CButton from "components/CustomButton/CustomButton.jsx";
import EnvironmentForm from "components/Environments/EnvironmentForm.jsx";
import SimpleModal from 'components/Modal/SimpleModal.jsx';
import EnvironmentCard from 'components/Card/EnvironmentCard.jsx';
import axios from 'axios';
import TENKAI_API_URL from 'env.js';

class Environments extends Component {

    state = {
        showInsertUpdateForm: false,
        envResult: { Envs: [] },
        inputFilter: "",
        showConfirmDeleteModal: false,
        showConfirmDuplicateModal: false,
        itemToDelete: {}, 
        itemToDuplicate: {},
    }

    componentDidMount() {
        this.getEnvironmentList();
    }

    handleConfirmDeleteModalClose() {
        this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
    }

    handleConfirmDeleteModalShow() {
        this.setState({ showConfirmDeleteModal: true });
    }

    handleConfirmDuplicateModalClose() {
        this.setState({ showConfirmDuplicateModal: false, itemToDuplicate: {} });
    }

    handleConfirmDuplicateModalShow() {

        this.setState({ showConfirmDuplicateModal: true }, () => {
            console.log('showing modal');
        });
    }    

    onChangeFilterHandler(e) {
        this.setState({
            inputFilter: e.target.value,
        })
    }

    getEnvironmentList() {
        axios.get(TENKAI_API_URL + '/environments')
            .then(response => this.setState({ envResult: response.data }))
            .catch(error => {
                console.log(error);
                if (error.response !== undefined) {
                    this.props.handleNotification("custom", "error", error.response.data);
                } else {
                    this.props.handleNotification("deployment_fail", "error");
                }
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
        console.log('navigateToEditEnvironment');
        this.setState(() => ({
            showInsertUpdateForm: true,
            editItem: item,
            editMode: true
        }));
        //window.scrollTo(0, 0);
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
    
    duplicateEnvironment(item) {
        this.setState({itemToDuplicate: item}, () => {
            console.log(this.state.itemToDuplicate);
            this.handleConfirmDuplicateModalShow();
        
        });
    }

    handleConfirmDuplicate() {
        this.props.handleLoading(true);
        if (this.state.itemToDuplicate !== undefined) {
            axios.get(TENKAI_API_URL + "/environments/duplicate/" + this.state.itemToDuplicate.ID)
                .then(res => {
                    this.props.handleLoading(false);
                    this.props.handleNotification("custom", "success", "Duplicated");
                    this.getEnvironmentList();
                }).catch(error => {
                    this.props.handleLoading(false);
                    this.props.handleNotification("general_fail", "error");
                });
        }
        this.setState({showConfirmDuplicateModal: false, itemToDuplicate: {}});
    }

    save(data, uri) {
        this.props.handleLoading(true);
        axios.post(TENKAI_API_URL + uri, { data })
            .then(res => {
                this.setState({ envResult: { Envs: [...this.state.envResult.Envs, data] } });
                this.props.handleLoading(false);
                this.props.handleNotification("custom", "success", "Saved");
                this.getEnvironmentList();
        }).catch(error => {
                console.log(error.message);
                this.props.handleLoading(false);
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
        this.props.handleLoading(true);
        if (this.state.itemToDelete !== undefined) {
            axios.delete(TENKAI_API_URL + "/environments/delete/" + this.state.itemToDelete.ID)
            .then(res => {
                this.props.handleLoading(false);
                this.props.handleNotification("custom", "success", "Deleted");
                this.getEnvironmentList();
            }).catch(error => {
                console.log(error.message);
                this.props.handleLoading(false);
                this.props.handleNotification("general_fail", "error");
            });
        }
        this.setState({showConfirmDeleteModal: false, itemToDelete: {}});
    }

    onExport(item) {
        axios.get(TENKAI_API_URL + `/environments/export/${item.ID}`).then(function(response) {
            console.log('aqui X');
            console.log(response.data);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `environment_${item.group}_${item.name}.txt`);
            document.body.appendChild(link);
            link.click();

          }).catch(function(error) {
            console.log(error.message);
            this.props.handleNotification("general_fail", "error");
        });        

    }

    render() {

        const items = this.state.envResult.Envs
            .filter(d => this.state.inputFilter === '' || d.name.includes(this.state.inputFilter)).map((item, key) =>
 
                <EnvironmentCard key={item.ID} id={item.id} 
                    keycloak={this.props.keycloak}
                    item={item}
                    group={item.group} 
                    name={item.name} 
                    clusterUri={item.cluster_uri}
                    namespace={item.namespace}
                    navigateToEditEnvironment={this.navigateToEditEnvironment.bind(this)}
                    navigateToEnvironmentVariables={this.navigateToEnvironmentVariables.bind(this)}
                    duplicateEnvironment={this.duplicateEnvironment.bind(this)}
                    onDelete={this.onDelete.bind(this)}
                    onExport={this.onExport.bind(this)}

                    />
                
            );

        return (

            <div className="content">

                <SimpleModal 
                    showConfirmDeleteModal={this.state.showConfirmDeleteModal}
                    handleConfirmDeleteModalClose={this.handleConfirmDeleteModalClose.bind(this)}
                    title="Confirm" subTitle="Delete environment" message="Are you sure you want to delete this environment?"
                    handleConfirmDelete={this.handleConfirmDelete.bind(this)}>  
                </SimpleModal>

                <SimpleModal 
                    showConfirmDeleteModal={this.state.showConfirmDuplicateModal}
                    handleConfirmDeleteModalClose={this.handleConfirmDuplicateModalClose.bind(this)}
                    title="Confirm" subTitle="Duplicate environment" message="Are you sure you want to duplicate this environment?"
                    handleConfirmDelete={this.handleConfirmDuplicate.bind(this)}>  
                </SimpleModal>


                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card 
                                title=""
                                content={
                                    <form>
                                        <CButton disabled={!this.props.keycloak.hasRealmRole("tenkai-admin")} className="pull-right" variant="primary" onClick={this.handleNewEnvironmentClick.bind(this)} >New Environment</CButton>
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
                            <Card plain
                                title="Environments"
                                content={
                                    <form>

                                        <Row>
                                            <Col xs={8}>
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
                                                </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={8}>
                                                    {items}
                                            </Col>
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


export default Environments;
