import React, { Component } from "react";
import {
    Table
} from "react-bootstrap";

export class PodPanel extends Component {
    

    state = {
        showConfirmDeleteModal: false,
        itemToDelete: {},
    }

    handleConfirmDeleteClose() {
        this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
    }

    handleConfirmDelete() {

    }

    showDeleteConfirmModal(item) {
        this.setState({showConfirmDeleteModal: true, itemToDelete: item});
    }

    render() {

        const list = this.props.list.map((item, key) =>
            <tr key={key}>
                <td>{item.name}</td>
                <td>{item.ready}</td>
                <td>{item.status}</td>
                <td>{item.restarts}</td>
                <td>{item.age}</td>
            </tr>
        );        

        return (

            <Table responsive >
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Ready</th>
                    <th>Status</th>
                    <th>Restarts</th>
                    <th>Age</th>
                </tr>
            </thead>
            <tbody>
                {list}
            </tbody>
            </Table>            

      

        );
    }
}

export default PodPanel;

