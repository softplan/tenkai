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

class Environments extends Component {

    state = {
        showInsertUpdateForm: false,
        envResult: {Envs:[]}
    }    

    componentDidMount() {
        this.getEnvironments()
    }

    getEnvironments() {
        axios.get('http://localhost:8080/environments')
        .then(response => this.setState({envResult: response.data}))
        .catch(error => console.log(error.message))
    }

    handleClick(e) {
        this.props.history.push('/admin/environments-envvars');
    }


    handleNewEnvironmentClick(e) {
        this.setState({ showInsertUpdateForm: true });
    }

    handleCancelEnvironmentClick(e) {
        this.setState({ showInsertUpdateForm: false });
    }    

    onSaveClick(data) {
        
        axios.post('http://localhost:8080/environments', { data })
          .then(res => {
           
            this.setState({envResult: {Envs: [...this.state.envResult.Envs, data]}});

            console.log("OK" + res);
            console.log(res.data);

         });

        this.setState({ showInsertUpdateForm: false });
                
    }    


    render() {

        const items = this.state.envResult.Envs.map((item, key) =>
            
            <tr key={key} onClick={this.handleClick.bind(this)}>
                <td>{key}</td>
                <td>{item.group}</td>
                <td>{item.name}</td>
                <td>{item.cluster_uri}</td>
                <td>{item.namespace}</td>
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
                            <EnvironmentForm saveClick={this.onSaveClick.bind(this)} cancelClick={this.handleCancelEnvironmentClick.bind(this)}/> : null 
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
