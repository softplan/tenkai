import React, { Component } from "react";
import {
     Row, Col, ButtonToolbar
  } from "react-bootstrap";
import Button from "components/CustomButton/CustomButton.jsx";
  

export class ActionCard extends Component {
  render() {
    return (
      <div className={"card" + (this.props.plain ? " card-plain" : "")}>
        <div className={"header" + (this.props.hCenter ? " text-center" : "")} style={{backgroundColor: "#FAFAFA"}}>
            <Row>
            <Col md={6}>
                <h4 className="title">{this.props.title}</h4>
            </Col>
            <Col md={6}>

                    <ButtonToolbar>
                      <Button className="btn btn-info pull-right btn-fill"
                        type="button" 
                        disabled={this.props.buttonsDisabled}
                        onClick={this.props.analyseOnClick}>
                        
                        <i className="pe-7s-eyedropper"/>{" "}Analyse Dependencies
                      </Button>

                      <Button className="btn btn-primary pull-right btn-fill"
                        type="button"
                        disabled={this.props.buttonsDisabled}
                        onClick={this.props.directDeployOnClick}>
                        
                        <i className="pe-7s-album"/>{" "}Direct Deploy
                      </Button>
                    </ButtonToolbar>

                
            </Col>
          </Row>  
        </div>
        <div
          className={
            "content" +
            (this.props.ctAllIcons ? " all-icons" : "") +
            (this.props.ctTableFullWidth ? " table-full-width" : "") +
            (this.props.ctTableResponsive ? " table-responsive" : "") +
            (this.props.ctTableUpgrade ? " table-upgrade" : "")
          }
        >
          {this.props.content}

          <div className="footer">
            {this.props.legend}
            {this.props.stats != null ? <hr /> : ""}
            <div className="stats">
              <i className={this.props.statsIcon} /> {this.props.stats}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ActionCard;
