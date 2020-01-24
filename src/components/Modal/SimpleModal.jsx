import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const SimpleModal = props => (
  <Modal
    show={props.showConfirmDeleteModal}
    onHide={props.handleConfirmDeleteModalClose}
  >
    <Modal.Header closeButton>
      <Modal.Title>{props.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <h4>{props.subTitle}</h4>
      <p>{props.message}</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="danger" onClick={props.handleConfirmDelete}>
        Yes
      </Button>
      <Button variant="primary" onClick={props.handleConfirmDeleteModalClose}>
        No
      </Button>
    </Modal.Footer>
  </Modal>
);

export default SimpleModal;
