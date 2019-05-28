import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";
import {
    Row,
    Col,
    Table
} from "react-bootstrap";
import axios from 'axios';

export class HelmVariables extends Component {

    state = {
        variables:[],
        values: new Map()
    }

    componentDidMount() {
        this.getVariables()
      }    

    onInputChange = event => {
        const { value, name } = event.target;
        this.setState(state => ({
            values: {
                ...state.values,
                [name]: value
            }
        }));
    }

    save() {

        console.log("Env: " + this.props.environment);
        console.log("Project: " + this.props.name);

       

        /*
        console.log(this.state.values);

        const values = queryString.parse(this.props.location.search);
        data.environmentId = parseInt(values.id);

        let payload = {data:[]}



        
        axios.post('http://localhost:8080/saveVariableValues', { payload })
          .then(res => {
            console.log("OK" + res);
         });        
         */

    }

    getVariables() {
        axios.get('http://localhost:8080/getChartVariables/' + this.props.name)
        .then(response => {

            if (response.data.app != null) {
                this.setState({variables: response.data.app});
            } else {
                this.setState({variables: []});
            }

        }).catch(error => console.log(error.message))
    }

    render() {

        const items = Object.keys(this.state.variables).map(key => {

            let valueTd;
            if (typeof this.state.variables[key] == 'object') {

                let innerObject = this.state.variables[key]
                const inner = Object.keys(innerObject).map(innerKey => {
                    return (
                        //TODO THINK HOW TO REPRESENT THIS IN A GOOD WAY !
                        <Table bordered>
                             <thead>
                                <th>Index</th>
                                <th>Name</th>
                                <th>Value</th>
                            </thead>
                            <tbody>
                                <td>{innerKey}</td>
                                <td>
                                    {innerObject[innerKey].name}
                                </td>
                                <td>
                                    {innerObject[innerKey].value}
                                </td>
                            </tbody>
                        </Table>
                        
                    );
                });

                valueTd = <td>{inner}</td>;
            } else {
                valueTd = <td>{this.state.variables[key]}</td>;
            }


            return (

            <tr key={key}>
                <td>{key}</td>
                {valueTd}
                <td><input name={key} value={this.state.values[key]} 
                    onChange={this.onInputChange}
                    type="text" style={{width: "370px"}}/></td>
            </tr>                

            );
          });        



      

        return (

            <Row>
                <Col md={12}>

                    <Card
                        title={this.props.name}
                        content={
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th style={{ width: "20%" }}>Variable</th>
                                            <th style={{ width: "40%" }}>Chart Default Value</th>
                                            <th style={{ width: "40%" }}>Environment Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items}
                                    </tbody>
                                </Table>

                        }
                    />
                </Col>
            </Row>

        );
    }
}

export default HelmVariables;
