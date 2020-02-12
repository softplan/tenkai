import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

export default class TenkaiTable extends Component {
  render() {
    let columns = [];

    this.renderColumnID(columns);
    this.renderColumnsFromProps(columns);

    return (
      <BootstrapTable
        bootstrap4
        keyField={this.getKeyField()}
        data={this.props.data}
        columns={columns}
      />
    );
  }

  getKeyField() {
    if (this.props.keyfield !== undefined) {
      return this.props.keyfield;
    }
    return 'ID';
  }

  renderColumnID(columns) {
    columns.push({
      dataField: this.getKeyField(),
      text: 'ID',
      sort: true,
      headerStyle: {
        width: '8%'
      }
    });
  }

  renderColumnsFromProps(columns) {
    this.props.columns.forEach(c => columns.push(c));
  }

}
