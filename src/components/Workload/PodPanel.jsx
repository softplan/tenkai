import React, { Component } from "react";
import {
    Table
} from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import SimpleModal from 'components/Modal/SimpleModal.jsx';
import { deletePod } from 'client-api/apicall.jsx';

export class PodPanel extends Component {
    

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
                <td>{item.image}</td>
                <td>{item.ready}</td>
                <td>{item.status}</td>
                <td>{item.restarts}</td>
                <td>{item.age}</td>
                <td><Button className="link-button" onClick={this.showDeleteConfirmModal.bind(this, item)}><i className="pe-7s-less" /></Button></td>
            </tr>
        );        

        return (
            <div>

                <SimpleModal 
                    showConfirmDeleteModal={this.state.showConfirmDeleteModal}
                    handleConfirmDeleteModalClose={this.handleConfirmDeleteClose.bind(this)}
                    title="Confirm" 
                    subTitle="Delete pod" 
                    message="Are you sure you want to delete this pod?"
                    handleConfirmDelete={this.handleConfirmDelete.bind(this)}/>                  

            <Table responsive >
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Ready</th>
                    <th>Status</th>
                    <th>Restarts</th>
                    <th>Age</th>
                    <th>Delete</th>
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

export default PodPanel;

