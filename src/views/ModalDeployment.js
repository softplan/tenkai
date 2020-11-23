import { Button, Modal } from 'react-bootstrap';
import React from 'react';
import TableDeploymentList from './TableDeploymentList';

export default function ModalDeployment(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.close}
      dialogClassName="deployment-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TableDeploymentList
          data={props.data}
          count={props.count}
          onLoad={props.onLoad}
          columns={props.columns}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.close}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
