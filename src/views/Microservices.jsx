import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    FormGroup, ControlLabel, Table, Button
} from "react-bootstrap";
import { thReleaseArray, tdReleaseArray } from "variables/Variables.jsx";
import Select from 'react-select';

import { Card } from "components/Card/Card.jsx";

import { ReleaseForm } from "components/Microservices/ReleaseForm.jsx";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



const options = [
    { value: 'gdx-legal', label: 'gdx-legal' },
    { value: 'gdx-saj', label: 'gdx-saj' },
    { value: 'tj-reports', label: 'tj-reports' }
];


class Microservices extends Component {

    state = {
        selectedOption: null,
        showInsertUpdateForm: false
    }

    handleEditClick(e) {
        this.props.history.push('/admin/microservices-deps');
    }

    handleNewReleaseClick(e) {
        this.setState({ showInsertUpdateForm: true });
    }

    handleCancelReleaseClick(e) {
        this.setState({ showInsertUpdateForm: false });
    }


    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    }

    render() {

        const { selectedOption } = this.state;

        return (
            <div className="content">
                <Grid fluid>
                    <Row>

                        <Col md={12}>
                            <Card
                                title=""
                                content={
                                    <form>

                                        <Row>
                                            <div className="col-md-5">
                                                <FormGroup>
                                                    <ControlLabel>Helm Chart</ControlLabel>
                                                    <Select value={selectedOption} onChange={this.handleChange} options={options} />
                                                </FormGroup>

                                            </div>
                                            <Button className="pull-right" variant="primary" onClick={this.handleNewReleaseClick.bind(this)}>New Release</Button>

                                        </Row>


                                        <div className="clearfix" />
                                    </form>
                                }
                            />
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col md={12}>
                        { this.state.showInsertUpdateForm ? 
                            <ReleaseForm cancelClick={this.handleCancelReleaseClick.bind(this)}/> : null 
                        }
                        </Col>
                    </Row>

                    <Row>

                        <Col md={12}>

                            <Card
                                title="Releases"
                                category="Version number"
                                ctTableFullWidth
                                ctTableResponsive
                                content={

                                    <Table striped hover >
                                        <thead>
                                            <tr>
                                                {thReleaseArray.map((prop, key) => {
                                                    return <th key={key}>{prop}</th>;
                                                })}
                                                <th style={{ width: "5%" }}></th>
                                                <th style={{ width: "5%" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tdReleaseArray.map((prop, key) => {
                                                return (
                                                    <tr key={key}>
                                                        {prop.map((prop, key) => {
                                                            return <td key={key}>{prop}</td>;
                                                        })}
                                                        <td><a href="#/" onClick={this.handleEditClick.bind(this)}><FontAwesomeIcon icon="edit" /></a></td>
                                                        <td><a href="#/"><FontAwesomeIcon icon="minus-circle" /></a></td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>

                                }
                            />

                        </Col>

                    </Row>

                </Grid>
            </div>
        );
    }
}

export default Microservices;
