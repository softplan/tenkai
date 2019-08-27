import React, { Component } from "react";
import {
    Table
} from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import SimpleModal from 'components/Modal/SimpleModal.jsx';
import { deletePod } from 'client-api/apicall.jsx';

export class ServicePanel extends Component {
    

    state = {
        itemToDelete: {},
        showConfirmDeleteModal: false,
    }

    handleConfirmDeleteClose() {
        this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
    }

    handleConfirmDelete() {
        deletePod(this, this.props.selectedEnvironment.value, this.state.itemToDelete.name, function (self) {
            self.setState({ showConfirmDeleteModal: false, itemToDelete: {}});
        });
    }

    showDeleteConfirmModal(item) {
        this.setState({showConfirmDeleteModal: true, itemToDelete: item});
    }

    
    render() {

        const list = this.props.list.map((item, key) =>
            <tr key={key}>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.clusterIP}</td>
                <td>{item.externalIP}</td>
                <td>{item.ports}</td>
                <td>{item.age}</td>
            </tr>
        );        

        return (
            <div>

                <SimpleModal 
                    showConfirmDeleteModal={this.state.showConfirmDeleteModal}
                    handleConfirmDeleteModalClose={this.handleConfirmDeleteClose.bind(this)}
                    title="Confirm" 
                    subTitle="Delete service" 
                    message="Are you sure you want to delete this service?"
                    handleConfirmDelete={this.handleConfirmDelete.bind(this)}/>                  

            <Table responsive >
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Cluster IP</th>
                    <th>External IP</th>
                    <th>Ports</th>
                    <th>Age</th>
                </tr>
            </thead>
            <tbody>
                {list}
            </tbody>
            </Table>            
            </div>

        );
    }
}

export default ServicePanel;

