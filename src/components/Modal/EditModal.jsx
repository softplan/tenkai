import React from 'react';
import { Modal } from 'react-bootstrap';

const EditModal = ({ onShow, header, title, onClose, form }) => (
  <Modal size="lg" show={onShow} onHide={e => onClose(e)}>
    {header && (
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
    )}
    <Modal.Body>{form}</Modal.Body>
  </Modal>
);

export default EditModal;
