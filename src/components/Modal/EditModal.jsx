import React, { Component } from "react";
import { Modal } from "react-bootstrap";

class EditModal extends Component {
   
    render() {
        
        return (
            <Modal bsSize="large" show={this.props.onShow} onHide={this.props.onClose.bind(this)}>
                <Modal.Body>
                    {this.props.form}
                </Modal.Body>
            </Modal>
        );
    }
}

export default EditModal;
