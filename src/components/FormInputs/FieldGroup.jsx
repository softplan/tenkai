import React from "react";
import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";

const FieldGroup = ({ label, ...props }) => (
  <FormGroup>
    <ControlLabel>{label}</ControlLabel>
    <FormControl {...props} />
  </FormGroup>
);

export default FieldGroup;
