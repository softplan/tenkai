import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from 'react-select';


class CopyModal extends Component {

    state = {
        selectedEnvironment: {},
    }

    handleEnvironmentChange = (selectedEnvironment) => {
        this.setState({ selectedEnvironment });
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
                        options={this.props.environments} />
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
