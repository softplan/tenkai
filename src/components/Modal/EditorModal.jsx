import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class EditorModal extends Component {
    render() {

        let content = this.props.yaml.split('\n').map((item, i) => {
            return <p key={i}>{item}</p>;
        });        
        
        return (
            <Modal show={this.props.show} onHide={this.props.close} bsSize="lg" >
                <Modal.Header closeButton>
                    <Modal.Title>Revision {this.props.item.revision} - {this.props.item.updated}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="scroller">
                        {content}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.close}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
export default EditorModal;
