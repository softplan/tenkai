import React from "react";
import { FormGroup, FormLabel, FormControl } from "react-bootstrap";

const FieldGroup = ({ label, ...props }) => (
  <FormGroup>
    <FormLabel>{label}</FormLabel>
    <FormControl {...props} />
  </FormGroup>
);

export default FieldGroup;
