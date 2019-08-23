import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import {UnControlled as CodeMirror} from 'react-codemirror2'

class EditorModal extends Component {

    render() {
      
        return (
            <Modal show={this.props.show} onHide={this.props.close} dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Revision {this.props.item.revision} - {this.props.item.updated}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
  
                    <CodeMirror value={this.props.yaml}
                        options={{
                            mode: 'yaml',
                            theme: 'material',
                            lineNumbers: false,
                            readOnly: true
                          }} 
                    />
                    

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.close}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
export default EditorModal;
