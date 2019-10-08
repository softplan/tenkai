import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { getAllEnvironments } from "client-api/apicall.jsx";

const CopyModal = props => {
  const [selectedEnvironment, setSelectedEnvironment] = useState({});
  const [envsOptions, setEnvsOptions] = useState([]);

  useEffect(() => {
    if (props.onlyMyEnvironments) {
      setEnvsOptions(props.environments);
    } else {
      getAllEnvironments(this, (envs, error) => {
        if (error) {
          props.handleNotification("custom", "error", error.message);
        } else {
          let options = [];
          for (let x = 0; x < envs.length; x++) {
            options.push({ label: envs[x].name, value: envs[x].ID });
          }
          setEnvsOptions(options);
        }
      });
    }
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
          onChange={selectedEnvironment =>
            setSelectedEnvironment(selectedEnvironment)
          }
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
        <Button onClick={e => props.onClose(e)}>No</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CopyModal;
