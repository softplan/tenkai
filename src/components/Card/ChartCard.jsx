import React, { Component } from "react";
import {
    ButtonToolbar
} from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";

export class ChartCard extends Component {
  render() {
    return (
        <div className={"card"}>
        <div className={"header"}>
          
          <h4 className="title">
          <input name={this.props.item.name + "@" + this.props.item.chartVersion} checked={this.props.selectedChartsToDeploy.indexOf(this.props.item.name + "@" + this.props.item.chartVersion) !== -1} type="checkbox" className="checkbox" onChange={this.props.handleCheckboxChange.bind(this)} />
          {this.props.item.name}</h4>
          <p className="category">{this.props.item.chartVersion}</p>
        </div>
        <div className={"content"}>
            <p><i>App Version: </i>{this.props.item.appVersion}</p>
            <p><i>Description: </i>{this.props.item.description}</p>
          <div className="footer">
            {this.props.clusterUri}
            <hr />
          </div>
          <ButtonToolbar>

          <Button className="btn-primary" bsSize="sm"onClick={this.props.deploy.bind(this, this.props.item.name + "@" + this.props.item.chartVersion)}
            ><i className="pe-7s-album"/>
                {" "}Direct Deploy</Button>

          <Button className="btn-info" bsSize="sm" onClick={this.props.analysis.bind(this, this.props.item.name + "@" + this.props.item.chartVersion)}
            ><i className="pe-7s-eyedropper"/>
                {" "}Dependency Analysis</Button>


          </ButtonToolbar>

        </div>
      </div>
    );
  }
}

export default ChartCard;
