import React from "react";
import { Modal, Button } from "react-bootstrap";
import { UnControlled as CodeMirror } from "react-codemirror2";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ButtonToolbar } from "react-bootstrap";

const HelmCommandModal = props => (
  <Modal show={props.show} onHide={props.close} dialogClassName="modal-90w">
    <Modal.Header closeButton>
      <Modal.Title>Helm</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <CodeMirror
        value={props.value}
        options={{
          mode: "shell",
          theme: "material",
          lineNumbers: false,
          readOnly: true
        }}
      />
    </Modal.Body>
    <Modal.Footer>
      <ButtonToolbar>
        <CopyToClipboard text={props.value}>
          <Button>Copy to clipboard</Button>
        </CopyToClipboard>
        <Button onClick={props.close}>Close</Button>
      </ButtonToolbar>
    </Modal.Footer>
  </Modal>
);

export default HelmCommandModal;
