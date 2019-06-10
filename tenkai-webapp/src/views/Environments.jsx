import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    FormControl, Table, InputGroup
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import EnvironmentForm from "components/Environments/EnvironmentForm.jsx";
import axios from 'axios';
import TENKAI_API_URL from 'env.js';

class Environments extends Component {

    state = {
        showInsertUpdateForm: false,
        envResult: {Envs:[]}
    }    

    componentDidMount() {
        this.getEnvironments()
    }

    getEnvironments() {
        axios.get(TENKAI_API_URL + '/environments')
        .then(response => this.setState({envResult: response.data}))
        .catch(error => console.log(error.message))
    }

    navigateToEnvironmentVariables(id, group, name) {
        console.log("id: " + JSON.stringify(id));
        this.props.history.push({
            pathname: "/admin/environments-envvars", 
            search: "?id="+id,
            state: { item: {group: group, name: name } }
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
            });
        this.setState(() => ({ 
            showInsertUpdateForm: false,
            editItem: {},
            editMode: false
        }));
    }

    onDelete(item) {
        axios.delete(TENKAI_API_URL + "/environments/delete/" + item.ID, )
            .then(res => {
                this.getEnvironments();
            })
    }

    render() {

        const items = this.state.envResult.Envs.map((item, key) =>
            
            <tr key={key}>
                <td onClick={this.navigateToEnvironmentVariables.bind(this, item.ID, item.group, item.name)}>{item.ID}</td>
                <td onClick={this.navigateToEnvironmentVariables.bind(this, item.ID, item.group, item.name)}>{item.group}</td>
                <td onClick={this.navigateToEnvironmentVariables.bind(this, item.ID, item.group, item.name)}>{item.name}</td>
                <td onClick={this.navigateToEnvironmentVariables.bind(this, item.ID, item.group, item.name)}>{item.cluster_uri}</td>
                <td onClick={this.navigateToEnvironmentVariables.bind(this, item.ID, item.group, item.name)}>{item.namespace}</td>
                <td onClick={this.navigateToEditEnvironment.bind(this, item)}>Edit</td>
                <td onClick={this.onDelete.bind(this, item)}>Delete</td>
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

                                        <div className="col-md-8" style={{ padding: '8px 0px' }}>
                                            <InputGroup>
                                                <FormControl
                                                    placeholder="Search using any field" aria-label="Search using any field"
                                                />
                                                <InputGroup.Button>
                                                    <Button  variant="outline-secondary" >Search</Button>
                                                </InputGroup.Button>
                                            </InputGroup>
                                            
                                        </div>
                                        <Button className="pull-right" variant="primary" onClick={this.handleNewEnvironmentClick.bind(this)} >New Environment</Button>
                                        <div className="clearfix" />
                                    </form>
                                    
                                }
                                />
                        </Col>
                        </Row>

                        <Row>
                        <Col md={12}>
                        { this.state.showInsertUpdateForm ? 
                            <EnvironmentForm editMode={this.state.editMode} editItem={this.state.editItem} saveClick={this.onSaveClick.bind(this)} cancelClick={this.handleCancelEnvironmentClick.bind(this)}/> : null 
                        }
                        </Col>
                        </Row>                        


                        <Row>
                           <Col md={12}>
                            <Card
                                title="Environments"
                                content={
                                    <form>
                                        <div>
                                        <Table  bordered hover size="sm">
                                            <thead>
                                                <tr>
                                                <th>#</th>
                                                <th>Group</th>
                                                <th>Environment Name</th>
                                                <th>Cluster URI</th>
                                                <th>Namespace</th>
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


export default Environments;
