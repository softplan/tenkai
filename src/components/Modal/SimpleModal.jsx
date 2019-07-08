import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class SimpleModal extends Component {
    render() {
        
        return (
            <Modal show={this.props.showConfirmDeleteModal} onHide={this.props.handleConfirmDeleteModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>{this.props.subTitle}</h4>
                    <p>{this.props.message}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{marginBottom: 0 }} onClick={this.props.handleConfirmDelete}>Yes</Button>
                    <Button onClick={this.props.handleConfirmDeleteModalClose}>No</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
export default SimpleModal;
