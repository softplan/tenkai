import React, { Component } from 'react';
import Button from 'components/CustomButton/CustomButton.jsx';
import SimpleModal from 'components/Modal/SimpleModal.jsx';
import { deletePod } from 'client-api/apicall.jsx';
import TenkaiTable from 'components/Table/TenkaiTable';
import * as col from 'components/Table/TenkaiColumn';

export class PodPanel extends Component {
  state = {
    itemToDelete: {},
    showConfirmDeleteModal: false
  };

  handleConfirmDeleteClose() {
    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  handleConfirmDelete() {
    deletePod(
      this,
      this.props.selectedEnvironment.value,
      this.state.itemToDelete.name,
      function(self) {
        self.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
      }
    );
  }

  showDeleteConfirmModal(item) {
    this.setState({ showConfirmDeleteModal: true, itemToDelete: item });
  }

  btnDeletePod = (cell, row) => {
    return (
      <Button
        className="link-button"
        onClick={this.showDeleteConfirmModal.bind(this, row)}
      >
        <i className="pe-7s-less cell-button-icon" />
      </Button>
    );
  };

  render() {
    let columns = [];
    columns.push(col.addCol('name', 'Name', '25%'));
    columns.push(col.addCol('image', 'Image', '35%'));
    columns.push(col.addCol('ready', 'Ready', '5%'));
    columns.push(col.addCol('status', 'Status'));
    columns.push(col.addCol('restarts', 'Restarts'));
    columns.push(col.addCol('age', 'Age'));
    columns.push(col.addColBtn('delPod', 'Delete', this.btnDeletePod, '5%'));

    const data = this.props.list;

    return (
      <div>
        <SimpleModal
          showConfirmDeleteModal={this.state.showConfirmDeleteModal}
          handleConfirmDeleteModalClose={this.handleConfirmDeleteClose.bind(
            this
          )}
          title="Confirm"
          subTitle="Delete pod"
          message="Are you sure you want to delete this pod?"
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}
        />
        <TenkaiTable columns={columns} data={data} bordered={false} />
      </div>
    );
  }
}

export default PodPanel;
