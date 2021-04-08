import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';

const CopyModal = props => {
  const [selectedEnvironment, setSelectedEnvironment] = useState({});
  const [envsOptions, setEnvsOptions] = useState([]);

  useEffect(() => {
    setEnvsOptions(props.environments);
  }, [props]);

  return (
    <Modal show={props.onShow} onHide={e => props.onClose(e)}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Environments:</p>
        <Select
          value={selectedEnvironment}
          onChange={environment => setSelectedEnvironment(environment)}
          options={envsOptions}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{ marginBottom: 0 }}
          onClick={() => props.onConfirm(selectedEnvironment)}
        >
          Yes
        </Button>
        <Button onClick={props.onClose}>No</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CopyModal;
