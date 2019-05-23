import React, { Component } from "react";
import {
    Grid,
    Row,
    Col, InputGroup, 
    FormControl, Table
} from "react-bootstrap";
import queryString from 'query-string';
import axios from 'axios';



import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

import { VariablesForm } from "components/Environments/VariablesForm.jsx";


class Variables extends Component {

    state = {
        item: {},
        showInsertUpdateForm: false,
        variablesResult: {Variables: []}
                
    }    

    componentDidMount() {
        this.getScopedVariables()
    }

    getScopedVariables() {

        const values = queryString.parse(this.props.location.search)

        axios.get('http://localhost:8080/variables/' + values.id )
        .then(response => this.setState({variablesResult: response.data}))
        .catch(error => console.log(error.message))
    }



    handleNewClick(e) {
        this.setState({ showInsertUpdateForm: true });
    }

    handleCancelClick(e) {
        this.setState({ showInsertUpdateForm: false });
    }    

    render() {

        const items = this.state.variablesResult.Variables.map((item, key) =>
            
        <tr key={key}>
            <td>{item.scope}</td>
            <td>{item.name}</td>
            <td>{item.value}</td>
            <td>{item.description}</td>
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

                                        <h2>{this.props.location.state.item.name}</h2> 

                                        <div className="col-md-8" style={{ padding: '8px 0px' }}>
                                            <InputGroup>
                                                <FormControl
                                                    placeholder="Search variables using any field" aria-label="Search variables using any field"
                                                />
                                                <InputGroup.Button>
                                                    <Button  variant="outline-secondary" >Search</Button>
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
                        { this.state.showInsertUpdateForm ? 
                            <VariablesForm cancelClick={this.handleCancelClick.bind(this)}/> : null 
                        }
                        </Col>
                    </Row>

                    <Row>
                            <Col md={12}>
                                <Card
                                    title="Global variables"
                                    content={
                                        <form>


                                            <Row>

                                        
                                            <Table  bordered hover size="sm">
                                                <thead>
                                                    <tr>
                                                    <th>Variable Name</th>
                                                    <th>Value</th>
                                                    <th>Description</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                    <td>MONGO_URI</td>
                                                    <td>mongodb://172.23.21.2:5555</td>
                                                    <td>Endereço do banco de dados Mongo externo ao K8S</td>
                                                    </tr>
                                                </tbody>
                                                </Table>
            
                                            </Row>

                                        
                                            
                                        </form>
                                    }
                                />
                            </Col>
                        </Row>


                        <Row>
                            <Col md={12}>
                                <Card
                                    title="Microservice specified variables"
                                    content={
                                        <form>

                                            <Row>
                                        
                                            <Table  bordered hover size="sm">
                                                <thead>
                                                    <tr>
                                                    <th>Microservice</th>
                                                    <th>Variable Name</th>
                                                    <th>Value</th>
                                                    <th>Description</th>
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
