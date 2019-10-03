import React from "react";
import { Modal, Button } from "react-bootstrap";
import { UnControlled as CodeMirror } from "react-codemirror2";

const EditorModal = props => (
  <Modal show={props.show} onHide={props.close} dialogClassName="modal-90w">
    <Modal.Header closeButton>
      <Modal.Title>
        Revision {props.item.revision} - {props.item.updated}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <CodeMirror
        value={props.yaml}
        options={{
          mode: "yaml",
          theme: "material",
          lineNumbers: false,
          readOnly: true
        }}
      />
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={props.close}>Close</Button>
    </Modal.Footer>
  </Modal>
);

export default EditorModal;
