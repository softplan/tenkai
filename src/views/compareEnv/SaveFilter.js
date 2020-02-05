import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const SaveFilter = props => (
  <Modal show={props.showModal} onHide={props.handleCancel}>
    <Modal.Header closeButton>
      <Modal.Title>Save compare environment query?</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form.Group>
        <Form.Label>Type a Query Name</Form.Label>
        <Form.Control type="text" onChange={props.handleSaveName} />
      </Form.Group>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={props.handleSaveConfirm}>
        Save
      </Button>
      <Button variant="secondary" onClick={props.handleCancel}>
        Cancel
      </Button>
    </Modal.Footer>
  </Modal>
);

export default SaveFilter;
