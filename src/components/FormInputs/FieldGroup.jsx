import React from 'react';
import { Form } from 'react-bootstrap';

const FieldGroup = ({ label, ...props }) => (
  <Form.Group>
    <Form.Label>{label}</Form.Label>
    <Form.Control {...props} />
  </Form.Group>
);

export default FieldGroup;
