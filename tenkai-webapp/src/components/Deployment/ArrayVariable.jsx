import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";
import {
    Row,
    Col,
    Table
} from "react-bootstrap";


class DefaultChartValue extends Component {

    render() {
        let index=this.props.index;
        const elements =  Object.keys(this.props.element).map(item => {
            console.log(item + "=>" + this.props.element[item]);
            return (
                <ul key={item}>
                    <li>[{index}].{item}={this.props.element[item]}</li>
                </ul>
            )
        });
        return (
            <td>{elements}</td>
        );
    }
}

export class ArrayVariable extends Component {


    render() {
        const items = Object.keys(this.props.variables).map(index => {
            return (
                <DefaultChartValue key={index} index={index} element={this.props.variables[index]} />
            )
        });

        return (
            <tr>
                <td>{this.props.name}</td>
                {items}
                <td>k</td>
            </tr>
        );
    }

}

export default ArrayVariable;
