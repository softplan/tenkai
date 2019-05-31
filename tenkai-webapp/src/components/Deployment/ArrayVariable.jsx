import React, { Component } from "react";
import {
    Table,
    Button
} from "react-bootstrap";


class TableRow extends Component {
    
    onInputChange(event) {

        console.log(event);

        this.props.onInputChange(event.target.name, event.target.value);

    }

    render() {
        let index=this.props.index;
        const variables =  Object.keys(this.props.element).map(item => {

            let variableName = `${this.props.baseVarName}[${index}].${item}`;
            const value = this.props.values[variableName] || "";
            return (
                <tr key={item}>
                    <td>{variableName}</td>
                    <td>{this.props.element[item]}</td>
                    <td><input name={variableName} type="text" value={value} onChange={this.onInputChange.bind(this)} style={{width: "100%"}}/>
                    </td>
                </tr>
        )
        });
        return (
            <tbody>{variables}</tbody>
        )
    }
}

export class ArrayVariable extends Component {

    onCreateDynamicVariable(variableName) {
        this.props.onCreateDynamicVariable(variableName);
    }

    render() {

        const fieldNames = Object.keys(this.props.variables).map(index => {
            return (
                <TableRow key={index} baseVarName={this.props.name} 
                    index={index} 
                    element={this.props.variables[index]} 
                    values={this.props.values}
                    onInputChange={this.props.onInputChange}/>
            )
        });

         return (
            <tr>
                <td colSpan="3"> 

                    <Button bsStyle="info" type="button" className="pull-right" 
                            onClick={this.onCreateDynamicVariable.bind(this,this.props.name)} >
                        Add Dynamic Variable
                    </Button>   
                    

                    <Table>
                        <thead>
                            <tr>
                                <th style={{ width: "20%" }}>Dynamic Variable</th>
                                <th style={{ width: "40%" }}>Chart Default Value</th>
                                <th style={{ width: "40%" }}>Environment Value</th>
                            </tr>
                        </thead>
                        {fieldNames}
                    </Table>

                </td>
            </tr>
        );
    }

}

export default ArrayVariable;
