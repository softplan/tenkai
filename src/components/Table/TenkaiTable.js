import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';

export default class TenkaiTable extends Component {
  render() {
    let columns = [];

    this.renderColumnID(columns);
    this.renderColumnsFromProps(columns);
    this.shouldRenderEditButton(columns);
    this.shouldRenderDeleteButton(columns);
    this.shouldRenderItemsButton(columns);

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

  shouldRenderEditButton(columns) {
    if (this.props.edit !== undefined) {
      columns.push({
        dataField: 'edit',
        text: 'Edit',
        sort: false,
        isDummyField: true,
        formatter: this.editButton,
        headerStyle: {
          width: '8%'
        }
      });
    }
  }

  shouldRenderDeleteButton(columns) {
    if (this.props.delete !== undefined) {
      columns.push({
        dataField: 'delete',
        text: 'Delete',
        sort: false,
        isDummyField: true,
        formatter: this.deleteButton,
        headerStyle: {
          width: '8%'
        }
      });
    }
  }

  shouldRenderItemsButton(columns) {
    if (this.props.viewItems !== undefined) {
      columns.push({
        dataField: 'items',
        text: 'View Items',
        sort: false,
        isDummyField: true,
        formatter: this.viewItemsButton,
        headerStyle: {
          width: '8%'
        }
      });
    }
  }

  editButton = (cell, row) => {
    return (
      <Button className="link-button" onClick={this.props.edit.bind(this, row)}>
        <i className="pe-7s-edit" />
      </Button>
    );
  };

  deleteButton = (cell, row) => {
    return (
      <Button
        className="link-button"
        onClick={this.props.delete.bind(this, row)}
      >
        <i className="pe-7s-trash" />
      </Button>
    );
  };

  viewItemsButton = (cell, row) => {
    return (
      <Button
        className="link-button"
        onClick={this.props.viewItems.bind(this, row)}
      >
        <i className="pe-7s-album" />
      </Button>
    );
  };
}
