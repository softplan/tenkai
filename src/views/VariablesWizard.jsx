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
    envId: "",
    charts: [],
    chartVersions: new Map(),
  }

  componentDidMount() {
    let total = this.props.location.state.charts.length;
    let helmCharts = [];
    let chartVersion = "";
    let value = ""; 
    let chartVersions = new Map();
    for (let i = 0; i < total; i++) {
      value = this.props.location.state.charts[i].substring(0, this.props.location.state.charts[i].indexOf("@"))
      helmCharts.push(value);
      chartVersion = this.props.location.state.charts[i].substring(this.props.location.state.charts[i].indexOf("@") + 1, this.props.location.state.charts[i].length)
      chartVersions[value] = chartVersion;
    }
    this.setState({charts: helmCharts, chartVersions: chartVersions });
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
        this.props.handleLoading(false);
        console.log("Error deploying: " + error.message);
        this.props.handleNotification("deployment_fail", "error");
    });

  }

  onClick = () => {

    let payload={deployables:[]};
    let count = 0;
    const totalCharts = this.state.charts.length;

    this.state.charts.forEach((item, key) => {
      
        this.refs["h" + key].save( (data) => {
          payload.deployables.push(data);
          count++;
          if (count === totalCharts) {
            this.onSave(payload);
          }
        });

    });

    

  }

  render() {

    const envId = this.state.envId;
    const items = this.state.charts.map((item, key) =>

      <HelmVariables handleLoading={this.props.handleLoading} 
                    handleNotification={this.props.handleNotification} 
                    key={key} chartName={item}  chartVersion={this.state.chartVersions[item]}
                    ref={"h" + key} 
                    envId={envId}/>
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
