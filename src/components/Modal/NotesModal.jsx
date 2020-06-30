import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { ButtonToolbar } from 'react-bootstrap';
import 'codemirror/theme/3024-night.css';
import 'codemirror/mode/markdown/markdown.js';

class NotesModal extends Component {
  constructor(props) {
    super(props);
    this.instance = null;
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.close} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            Notes for Helm Chart {this.props.serviceName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CodeMirror
            value={this.props.value}
            options={{
              mode: 'markdown',
              theme: '3024-night',
              lineNumbers: false,
              readOnly: false
            }}
            editorDidMount={editor => {
              setTimeout(() => editor.refresh(), 200);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button onClick={this.props.close}>Save</Button>
            <Button onClick={this.props.close}>Close</Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default NotesModal;
