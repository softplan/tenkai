import React, { Component } from "react";
import { Modal } from "react-bootstrap";

class EditModal extends Component {
   
    render() {

        function Header(props) {
            
            if (props.props.header) {
                return (
                    <Modal.Header closeButton>
                        <Modal.Title>{props.props.title}</Modal.Title>
                    </Modal.Header>                    
                );
            } else {
                return (
                    <div></div>
                )
            }
        }
        
        return (
            <Modal bsSize="large" show={this.props.onShow} onHide={this.props.onClose.bind(this)}>
                <Header props={this.props}/>
                <Modal.Body>
                    {this.props.form}
                </Modal.Body>
            </Modal>
        );
    }
}

export default EditModal;
