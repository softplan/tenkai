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
import axios from 'axios';
import TENKAI_API_URL from 'env.js';


class VariablesWizard extends Component {

  state = {
    envId: ""
  }

  constructor(props) {
    super(props);
    const values = queryString.parse(props.location.search);
    this.state.envId = values.environment;
  }

  onSave = (payload) => {
    this.props.handleLoading(true);
    axios.post(TENKAI_API_URL + '/multipleInstall', payload).then(() => {
        this.props.handleNotification("deployment_ok", "success");
        console.log('OK -> DEPLOYED => After notification');
        this.props.handleLoading(false);
    }).catch(error => {
        console.log("Error deploying: " + error.message);
        this.props.handleNotification("deployment_fail", "error");
        this.props.handleLoading(false);
    });

  }

  onClick = () => {

    let payload={deployables:[]};
    let count = 0;
    const totalCharts = this.props.location.state.charts.length;

    this.props.location.state.charts.forEach((item, key) => {
      
        this.refs["h" + key].save( (data) => {
          console.log("Adding: " + JSON.stringify(data));
          payload.deployables.push(data);
          count++;
          if (count == totalCharts) {
            this.onSave(payload);
          }
        });

    });

    

  }

  render() {

    const envId = this.state.envId;
    const items = this.props.location.state.charts.map((item, key) =>
      <HelmVariables handleLoading={this.props.handleLoading} handleNotification={this.props.handleNotification} key={key} name={item} ref={"h" + key} envId={envId}/>
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
