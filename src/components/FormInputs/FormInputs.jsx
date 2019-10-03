import React from "react";
import { Row } from "react-bootstrap";
import FieldGroup from "./FieldGroup";

export const FormInputs = props => {
  let row = [];
  for (let i = 0; i < props.ncols.length; i++) {
    row.push(
      <div key={i} className={props.ncols[i]}>
        <FieldGroup {...props.properties[i]} />
      </div>
    );
  }

  return <Row>{row}</Row>;
};

export default FormInputs;
