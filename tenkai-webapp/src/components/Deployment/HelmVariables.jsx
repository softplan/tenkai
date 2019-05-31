import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";
import {
    Row,
    Col,
    Table
} from "react-bootstrap";
import axios from 'axios';
import ArrayVariable from "components/Deployment/ArrayVariable.jsx"

export class HelmVariables extends Component {

    state = {
        variables:{},
        values: {}
    }

    componentDidMount() {
        this.getVariables()
    }    

    addDynamicVariableClick(variableName) {
        let dbArray = [...this.state.variables[variableName]];
        let item = {}
        if (dbArray.length > 0) {
            for (let element of dbArray.keys()) {
                item = dbArray[element];
            }        
        } else {
            item = {name: "", value:""};
        }
        dbArray.push(item);
        this.setState(state => ({
            variables: {
                ...state.variables,
                [variableName]: dbArray
            }
        }));
    }

    onInputChangeFromChild(name, value){
        console.log('here on input change');
        this.setState(state => ({
            values: {
                ...state.values,
                [name]: value
            }
        }), function() {
            console.log(this.state.values);
        });
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
        
        const scope = this.props.name;
        const environmentId = parseInt(this.props.envId);
        let payload = {data: []};

        const elements = this.state.values;

        Object.keys(this.state.values).map(function(key, index) {
            payload.data.push({scope: scope, name: key, value: elements[key], environmentId: environmentId});
            return null;
        });

        let data = payload.data;

        axios.post('http://localhost:8080/saveVariableValues', { data })
          .then(res => {

           let installPayload = {};
           installPayload.namespace = "master";
           const environmentId = parseInt(this.props.envId);

           var n = scope.indexOf("/");
           installPayload.name = scope.substring(n+1) + "-" + installPayload.namespace
           installPayload.chart = scope
            
           let args = []

           Object.keys(this.state.values).map(function(key, index) {
                args.push({name: key, value: elements[key]});
                return null;
           });
           installPayload.arguments = args;
           installPayload.environmentId = environmentId;
           
           axios.post('http://localhost:8080/install', installPayload).then(function() {
               console.log('OK -> DEPLOYED');
           });

         });

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

        const scope = this.props.name;
        const environmentId = parseInt(this.props.envId);

        axios.post('http://localhost:8080/listVariables', { environmentId: environmentId, scope: scope })
        .then(response => {

            this.addToValues(response.data.Variables);

        }).catch(error => console.log(error.message))

    }

    addToValues(variables) {
        let valuesMap = new Map();
        variables.forEach((value, index, array) => {
            valuesMap[value.name] = value.value;
        });
        this.setState({
            values: valuesMap
        });
    }

    render() {

        const items = Object.keys(this.state.variables).map(key => {


            const value = this.state.values[key] || "";

            if (typeof this.state.variables[key] == 'object') {

                return(
                    <ArrayVariable key={key} name={key} 
                    variables={this.state.variables[key]} 
                    values={this.state.values}
                    onCreateDynamicVariable={this.addDynamicVariableClick.bind(this)} 
                    onInputChange={this.onInputChangeFromChild.bind(this)}/>
                )

            } else {
                return (
                    <tr key={key}>
                        <td>{key}</td>
                        <td>{this.state.variables[key]}</td>
                        <td><input name={key} value={value} 
                            onChange={this.onInputChange}
                            type="text" style={{width: "100%"}}/></td>
                    </tr>                
                );
            }
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
