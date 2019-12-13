import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ButtonToolbar } from 'react-bootstrap';
import 'codemirror/mode/shell/shell.js';

class HelmCommandModal extends Component {
  constructor(props) {
    super(props);
    this.instance = null;
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.close}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>Helm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CodeMirror
            value={this.props.value}
            options={{
              mode: 'shell',
              theme: 'material',
              lineNumbers: false,
              readOnly: true
            }}
            editorDidMount={editor => {
              setTimeout(() => editor.refresh(), 200);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <CopyToClipboard text={this.props.value}>
              <Button>Copy to clipboard</Button>
            </CopyToClipboard>
            <Button onClick={this.props.close}>Close</Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );;
  }
}

export default HelmCommandModal;;
