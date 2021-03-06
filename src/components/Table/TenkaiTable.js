import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

export default class TenkaiTable extends Component {
  render() {
    let columns = [];
    this.renderColumnsFromProps(columns);

    return (
      <BootstrapTable
        bootstrap4
        striped={this.striped()}
        hover
        condensed
        keyField={this.getKeyField()}
        data={this.props.data}
        columns={columns}
        bordered={this.props.bordered}
        rowClasses={this.props.rowClasses}
      />
    );
  }

  getKeyField() {
    if (this.props.keyfield !== undefined) {
      return this.props.keyfield;
    }
    return 'ID';
  }

  renderColumnsFromProps(columns) {
    this.props.columns.forEach(c => columns.push(c));
  }

  striped() {
    if (this.props.striped !== undefined) {
      return this.props.striped;
    }
    return true;
  }
}
