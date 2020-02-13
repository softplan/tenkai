import React, { Component } from 'react';
import SimpleModal from 'components/Modal/SimpleModal.jsx';
import { deletePod } from 'client-api/apicall.jsx';
import TenkaiTable from 'components/Table/TenkaiTable';
import * as col from 'components/Table/TenkaiColumn';

export class ServicePanel extends Component {
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

  render() {
    let columns = [];
    columns.push(col.addCol('name', 'Name', '25%'));
    columns.push(col.addCol('type', 'Type', '15%'));
    columns.push(col.addCol('clusterIP', 'ClusterIP', '15%'));
    columns.push(col.addCol('externalIP', 'ExternalIP'));
    columns.push(col.addCol('ports', 'Ports', '25%'));
    columns.push(col.addCol('age', 'Age'));

    const data = this.props.list;

    return (
      <div>
        <SimpleModal
          showConfirmDeleteModal={this.state.showConfirmDeleteModal}
          handleConfirmDeleteModalClose={this.handleConfirmDeleteClose.bind(
            this
          )}
          title="Confirm"
          subTitle="Delete service"
          message="Are you sure you want to delete this service?"
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}
        />
        <TenkaiTable columns={columns} data={data} bordered={false} />
      </div>
    );
  }
}

export default ServicePanel;
