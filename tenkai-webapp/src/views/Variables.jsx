import React, { Component } from "react";
import {
    Grid,
    Row,
    Col, InputGroup, 
    FormControl, Table
} from "react-bootstrap";


import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

import { VariablesForm } from "components/Environments/VariablesForm.jsx";


class Variables extends Component {

    state = {
        showInsertUpdateForm: false
    }    

    handleNewClick(e) {
        this.setState({ showInsertUpdateForm: true });
    }

    handleCancelClick(e) {
        this.setState({ showInsertUpdateForm: false });
    }    

    render() {

        return (
            <div className="content">
                <Grid fluid>
                <Row>
                    <Col md={12}>
                            <Card
                                title=""
                                content={
                                    <form>

                                        <h2>TK-XK Produção</h2> 

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
                                                    <tr>
                                                    <td>GDX_LEGAL</td>
                                                    <td>GDX_LEGAL_DB_NAME</td>
                                                    <td>legaldb</td>
                                                    <td>Nome da base de dados no mongo utilizado pelo GDX_LEGAL</td>
                                                    </tr>
                                                    <tr>
                                                    <td>GDX_SAJ</td>
                                                    <td>GDX_LEGAL_BACKEND</td>
                                                    <td>http://gdxlegal.tjsp.jus.br</td>
                                                    <td>Endereço URI do GDX_LEGAL</td>
                                                    </tr>

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
