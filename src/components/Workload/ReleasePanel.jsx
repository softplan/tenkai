import React, { Component } from "react";
import {
    Panel, ButtonToolbar, Table
} from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import { getReleaseHistory, deleteHelmRelease } from 'client-api/apicall.jsx';
import SimpleModal from 'components/Modal/SimpleModal.jsx';

export class ReleasePanel extends Component {

    state = {
        historyList: [],
        showConfirmDeleteModal: false,
    }

    showReleaseHistory(releaseName) {
        getReleaseHistory(this, this.props.selectedEnvironment.value, releaseName, function (self, res) {
            self.setState({ historyList: res.data });
        });
    }

    onEnter(releaseName) {
        this.showReleaseHistory(releaseName);
    }

    onExit() {
        this.setState({historyList:[]});
    }

    handleConfirmDeleteClose() {
        this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
    }

    handleConfirmDelete() {
        deleteHelmRelease(this, this.props.selectedEnvironment.value, this.state.itemToDelete, (self) => {
            self.props.refresh();
            this.setState({ showConfirmDeleteModal: false, itemToDelete: {}});
        });
    }

    showDeleteConfirmModal(releaseName) {
        this.setState({showConfirmDeleteModal: true, itemToDelete: releaseName});
    }

    render() {

        const historyList = this.state.historyList.map((item, key) =>
            <tr key={key}>
                <td>{item.revision}</td>
                <td>{item.updated}</td>
                <td>{item.status}</td>
                <td><i className="pe-7s-back-2" /></td>
                <td><i className="pe-7s-note2" /></td>
            </tr>
        );

        return (

            <Panel eventKey={this.props.eventKey} >

                <SimpleModal 
                    showConfirmDeleteModal={this.state.showConfirmDeleteModal}
                    handleConfirmDeleteModalClose={this.handleConfirmDeleteClose.bind(this)}
                    title="Confirm" 
                    subTitle="Delete release" 
                    message="Are you sure you want to delete this release?"
                    handleConfirmDelete={this.handleConfirmDelete.bind(this)}/>  

                <Panel.Heading>
                    <Panel.Title toggle>{this.props.item.Name} - revision {this.props.item.Revision}</Panel.Title>
                </Panel.Heading>

                <Panel.Collapse
                    onEnter={this.onEnter.bind(this, this.props.item.Name)}
                    onExit={this.onExit.bind(this, this.props.item.Name)} >

                    <Panel.Body>
                        <p>Chart: {this.props.item.Chart}</p>
                        <p>Updated: {this.props.item.Updated}</p>
                        <p>Status: {this.props.item.Status}</p>

                        <ButtonToolbar>

                            <Button className="btn btn-danger" bsSize="sm" onClick={this.showDeleteConfirmModal.bind(this, this.props.item.Name)}>
                                <i className="pe-7s-less" />{" "}Delete Purge
                            </Button>


                        </ButtonToolbar>

                        <Table responsive >
                            <thead>
                                <tr>
                                    <th>Revision</th>
                                    <th>Updated</th>
                                    <th>Status</th>
                                    <th>Rollback</th>
                                    <th>Inspect</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyList}
                            </tbody>
                        </Table>

                    </Panel.Body>
                </Panel.Collapse>

            </Panel>

        );
    }
}

export default ReleasePanel;

