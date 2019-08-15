import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select';
import { getAllEnvironments } from 'client-api/apicall.jsx';


class CopyModal extends Component {

    state = {
        selectedEnvironment: {},
        envs:[],
        envsOptions: [],
    }

    componentDidMount() {
        this.getEnvironments();
    }

    handleEnvironmentChange = (selectedEnvironment) => {
        this.setState({ selectedEnvironment });
    }
    
    getEnvironments() {

        getAllEnvironments(this, function(self) {
            let options = [];
            for (let x = 0; x < self.state.envs.length; x++) {
                options.push({label:self.state.envs[x].name, value:self.state.envs[x].ID});
            }
            self.setState({envsOptions:options});
        });
    }
    
    render() {
        
        return (
            <Modal show={this.props.onShow} onHide={this.props.onClose.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Environments:</p>
                    <Select  value={this.state.selectedEnvironment} onChange={this.handleEnvironmentChange} 
                        options={this.state.envsOptions} />
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{marginBottom: 0 }} onClick={this.props.onConfirm.bind(this, this.state.selectedEnvironment)}>Yes</Button>
                    <Button onClick={this.props.onClose.bind(this)}>No</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
export default CopyModal;
