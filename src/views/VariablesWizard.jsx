import React, { Component } from "react";
import {
  Grid,
  Row,
  Col
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import HelmVariables from "components/Deployment/HelmVariables.jsx";
import queryString from 'query-string';

class VariablesWizard extends Component {

  state = {
    envId: ""
  }

  constructor(props) {
    super(props);
    const values = queryString.parse(props.location.search);
    this.state.envId = values.environment;
  }


  onClick = () => {
    this.props.location.state.charts.map((item, key) => {
      this.refs["h" + key].save()
      return null;
    });
  }

  render() {

    const envId = this.state.envId;
    const items = this.props.location.state.charts.map((item, key) =>
      <HelmVariables handleNotification={this.props.handleNotification} key={key} name={item} ref={"h" + key} envId={envId}/>
    );     

    return (
      <div className="content">
        <Grid fluid>


          <Row>

            <Col md={12}>
              <Card
                title=""
                content={
                  <div>
                    <h3>Environment: {this.props.location.state.environment}</h3>
                    <Button bsStyle="info" 
                      fill 
                      pullRight 
                      type="button"
                      onClick={this.onClick}
                      >Install/Update</Button>
                    <div className="clearfix" />
                  </div>
                }
              />
            </Col>
          </Row>

          {items}


        </Grid>
      </div>
    );
  }
}

export default VariablesWizard;
