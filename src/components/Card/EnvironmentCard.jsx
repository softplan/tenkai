import React, { Component } from "react";
import {
    ButtonToolbar
  } from "react-bootstrap";
  import Button from "components/CustomButton/CustomButton.jsx";

export class EnvironmentCard extends Component {
  render() {
    return (
        <div className={"card"}>
        <div className={"header"}>
          <h4 className="title">{this.props.name}</h4>
          <p className="category">{this.props.group}</p>
        </div>
        <div className={"content"}>
            <i>Namespace: </i>{this.props.namespace}
          <div className="footer">
            {this.props.clusterUri}
            <hr />
          </div>
          <ButtonToolbar>

          <Button className="btn-primary" bsSize="sm" disabled={!this.props.keycloak.hasRealmRole("tenkai-admin")}
                         onClick={this.props.navigateToEditEnvironment.bind(this, this.props.item)}><i className="pe-7s-edit"/>
                         {" "}Edit</Button>

          <Button className="btn-primary" bsSize="sm" 
                        onClick={this.props.navigateToEnvironmentVariables.bind(this, this.props.item.ID, this.props.item.group, this.props.item.name)}><i className="pe-7s-plugin" />
                        {" "}Variables</Button>

          <Button className="btn-primary" bsSize="sm" disabled={!this.props.keycloak.hasRealmRole("tenkai-admin")}
                        onClick={this.props.duplicateEnvironment.bind(this, this.props.item)}><i className="pe-7s-magic-wand" />
                        {" "}Duplicate</Button>

          <Button className="btn-primary" bsSize="sm"
                        onClick={this.props.onExport.bind(this, this.props.item)}><i className="pe-7s-global" />
                        {" "}Export</Button>


          <Button className="btn-danger" bsSize="sm" disabled={!this.props.keycloak.hasRealmRole("tenkai-admin")}
                        onClick={this.props.onDelete.bind(this, this.props.item)}><i className="pe-7s-trash" />
                        {" "}Delete</Button>


          </ButtonToolbar>

        </div>
      </div>
    );
  }
}

export default EnvironmentCard;
