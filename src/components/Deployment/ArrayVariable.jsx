import React, { Component } from 'react';
import { Table, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

class TableRow extends Component {
  onInputChange(event) {
    this.props.onInputChange(event.target.name, event.target.value);
  }

  render() {
    let index = this.props.index;
    let element = this.props.element || '';
    const variables = Object.keys(element).map(item => {
      let variableName = `${this.props.baseVarName}[${index}].${item}`;
      const value = this.props.values[variableName] || '';
      const tooltip = (
        <Tooltip id="tooltip">{this.props.element[item]}}</Tooltip>
      );

      return (
        <tr key={item}>
          <td>{variableName}</td>
          <td>
            <OverlayTrigger
              placement="bottom"
              overlay={tooltip}
              delayShow={300}
              delayHide={150}
            >
              <input
                name={variableName}
                type="text"
                value={value}
                onChange={this.onInputChange.bind(this)}
                style={{ width: '100%' }}
              />
            </OverlayTrigger>
          </td>
        </tr>
      );
    });
    return <tbody>{variables}</tbody>;
  }
}

export class ArrayVariable extends Component {
  onCreateDynamicVariable(variableName) {
    this.props.onCreateDynamicVariable(variableName);
  }

  render() {
    let variables = this.props.variables || [];
    const fieldNames = Object.keys(variables).map(index => {
      return (
        <TableRow
          key={index}
          baseVarName={this.props.name}
          index={index}
          element={this.props.variables[index]}
          values={this.props.values}
          onInputChange={this.props.onInputChange}
        />
      );
    });

    return (
      <tr>
        <td colSpan="3">
          <Button
            variant="info"
            type="button"
            className="pull-right"
            onClick={this.onCreateDynamicVariable.bind(this, this.props.name)}
          >
            Add Dynamic Variable
          </Button>

          <Table>
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Dynamic Variable</th>
                <th style={{ width: '80%' }}>Environment Value</th>
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
