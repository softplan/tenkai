import React, { Component } from "react";
import {
    Panel, ButtonToolbar, Table
} from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
import { getReleaseHistory, deleteHelmRelease, getRevisionYaml, rollbackHelmRelease } from 'client-api/apicall.jsx';
import SimpleModal from 'components/Modal/SimpleModal.jsx';
import EditorModal from 'components/Modal/EditorModal.jsx';

export class ReleasePanel extends Component {

    state = {
        historyList: [],
        showConfirmDeleteModal: false,
        showConfirmRollbackModal: false,
        showEditorModal: false,
        historyRecord: {},
        itemToRollback: {},
        yaml: "",
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

    handleConfirmRollbackClose() {
        this.setState({ showConfirmRollbackModal: false, itemToRollback: {} });
    }

    handleConfirmDelete() {
        deleteHelmRelease(this, this.props.selectedEnvironment.value, this.state.itemToDelete, (self) => {
            self.props.refresh();
            this.setState({ showConfirmDeleteModal: false, itemToDelete: {}});
        });
    }

    handleConfirmRollback() {
        rollbackHelmRelease(this, this.props.selectedEnvironment.value, this.state.itemToRollback, (self) => {
            this.setState({ showConfirmRollbackModal: false, itemToRollback: {}}, () => {
                this.showReleaseHistory(this.props.item.Name);
            });
        });
    }

    showDeleteConfirmModal(releaseName) {
        this.setState({showConfirmDeleteModal: true, itemToDelete: releaseName});
    }

    showRollbackConfirmModal(revision) {
        let item = {releaseName: this.props.item.Name, revision};
        this.setState({showConfirmRollbackModal: true, itemToRollback: item});
    }

    closeEditorModal() {
        this.setState({showEditorModal: false, historyRecord: {}, yaml: ""});
    }

    showEditorModal(item) {
        getRevisionYaml(this, this.props.selectedEnvironment.value, this.props.item.Name, item.revision, (self, res) => {
            console.log(res);

            this.setState({historyRecord: item, yaml: res.data, showEditorModal: true});
        });
    }

    navigateToBlueGreenWizard(item) {
        this.props.navigateToBlueGreenWizard(item);
    }
    
    render() {

        const historyList = this.state.historyList.map((item, key) =>
            <tr key={key}>
                <td>{item.revision}</td>
                <td>{item.updated}</td>
                <td>{item.status}</td>

                <td><Button className="link-button" 
                        disabled={!this.props.keycloak.hasRealmRole("tenkai-promote")}
                        onClick={this.showRollbackConfirmModal.bind(this, item.revision)}>
                    <i className="pe-7s-back-2"/></Button></td>

                <td><Button className="link-button" 
                        disabled={!this.props.keycloak.hasRealmRole("tenkai-promote")}
                        onClick={this.showEditorModal.bind(this, item)}>
                    <i className="pe-7s-note2"/></Button></td>
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

                <SimpleModal 
                    showConfirmDeleteModal={this.state.showConfirmRollbackModal}
                    handleConfirmDeleteModalClose={this.handleConfirmRollbackClose.bind(this)}
                    title="Confirm" 
                    subTitle="Rollback release" 
                    message="Are you sure you want to rollback this release?"
                    handleConfirmDelete={this.handleConfirmRollback.bind(this)}/>  


                <EditorModal yaml={this.state.yaml} item={this.state.historyRecord} show={this.state.showEditorModal} close={this.closeEditorModal.bind(this)}/>

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

                            <Button className="btn btn-info btn-fill" bsSize="sm" onClick={this.navigateToBlueGreenWizard.bind(this, this.props.item)}>
                                <i className="pe-7s-keypad" />{" "}Blue/Green or Canary Strategy Wizard
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

