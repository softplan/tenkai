import React from "react";
import { ButtonToolbar } from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";

export const EnvironmentCard = props => (
  <div className={"card"}>
    <div className={"header"}>
      <h4 className="title">{props.name}</h4>
      <p className="category">{props.group}</p>
    </div>
    <div className={"content"}>
      <i>Namespace: </i>
      {props.namespace}
      <div className="footer">
        {props.clusterUri}
        <hr />
      </div>
      <ButtonToolbar>
        <Button
          className="btn-primary"
          size="sm"
          disabled={!props.keycloak.hasRealmRole("tenkai-admin")}
          onClick={() => props.navigateToEditEnvironment(props.item)}
        >
          <i className="pe-7s-edit" /> Edit
        </Button>

        <Button
          className="btn-primary"
          size="sm"
          onClick={() =>
            props.navigateToEnvironmentVariables(
              props.item.ID,
              props.item.group,
              props.item.name
            )
          }
        >
          <i className="pe-7s-plugin" /> Variables
        </Button>

        <Button
          className="btn-primary"
          size="sm"
          disabled={!props.keycloak.hasRealmRole("tenkai-admin")}
          onClick={() => props.duplicateEnvironment(props.item)}
        >
          <i className="pe-7s-magic-wand" /> Duplicate
        </Button>

        <Button
          className="btn-primary"
          size="sm"
          onClick={() => props.onExport(props.item)}
        >
          <i className="pe-7s-global" /> Export
        </Button>

        <Button
          className="btn-danger"
          size="sm"
          disabled={!props.keycloak.hasRealmRole("tenkai-admin")}
          onClick={() => props.onDelete(props.item)}
        >
          <i className="pe-7s-trash" /> Delete
        </Button>
      </ButtonToolbar>
    </div>
  </div>
);

export default EnvironmentCard;
