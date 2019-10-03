import React from "react";
import { ButtonToolbar } from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

const Header = props =>
  props.item.secret ? (
    <h4 className="title">
      <b>{props.item.name} = ************************ </b>
    </h4>
  ) : (
    <h4 className="title">
      <b>
        {props.item.name} = {props.item.value}{" "}
      </b>
    </h4>
  );

export const HelmCard = props => (
  <div className={"card"} style={{ backgroundColor: "#FCFFEC" }}>
    <div className={"header"}>
      <Header item={props.item} />
      <p className="category">{props.item.scope}</p>
    </div>
    <div className={"content"}>
      <p>{props.item.description}</p>
      <div className="footer">
        <hr />
      </div>

      <ButtonToolbar>
        {props.navigateToEditEnvironment ? (
          <Button
            className="btn btn-primary"
            size="sm"
            onClick={() => props.navigateToEditEnvironment(props.item)}
          >
            <i className="pe-7s-edit" /> Edit
          </Button>
        ) : (
          <div></div>
        )}

        <Button
          className="btn btn-danger"
          size="sm"
          onClick={() => props.onDelete(props.item)}
        >
          <i className="pe-7s-trash" /> Delete
        </Button>
      </ButtonToolbar>
    </div>
  </div>
);

export default HelmCard;
