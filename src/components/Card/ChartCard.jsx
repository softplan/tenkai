import React, { Component } from "react";
import {
    ButtonToolbar
} from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

export class ChartCard extends Component {
  render() {
    return (
        <div className={"card chart"}>

        <div className={"header"}>

            <ButtonToolbar>

              <Button className="btn-primary btn-fill" bsSize="sm"onClick={this.props.deploy.bind(this, this.props.item.name + "@" + this.props.item.chartVersion)}
                ><i className="pe-7s-album"/>{" "}Deploy
                    </Button>

              <Button className="btn-info btn-fill" bsSize="sm" onClick={this.props.analysis.bind(this, this.props.item.name + "@" + this.props.item.chartVersion)}
                ><i className="pe-7s-eyedropper"/>{" "}Analyse
                    </Button>

              <Button className="btn" bsSize="sm" onClick={this.props.addToDeployList.bind(this, this.props.item.name + "@" + this.props.item.chartVersion)}
                ><i className="pe-7s-angle-right-circle"/>{" "}Multiple deploy
                    </Button>

            </ButtonToolbar>
        </div>



        <div className={"header"}>
          
          <h4 className="title">
          
          <b>{this.props.item.name}</b></h4>
          <p className="category">{this.props.item.chartVersion}</p>
        </div>
        <div className={"content"}>
            <p><i>App Version: </i>{this.props.item.appVersion}</p>
            <p><i>Description: </i>{this.props.item.description}</p>
        </div>
      </div>
    );
  }
}

export default ChartCard;
