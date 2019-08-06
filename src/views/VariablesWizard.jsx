import React, { Component } from "react";
import {
  Grid,
  Row,
  Col, ButtonToolbar
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import HelmVariables from "components/Deployment/HelmVariables.jsx";
import queryString from 'query-string';
import { multipleInstall } from "client-api/apicall.jsx"

class VariablesWizard extends Component {

  state = {
    envId: "",
    charts: [],
    chartVersions: new Map()
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
    this.setState({ charts: helmCharts, chartVersions: chartVersions }, async () => {
      this.props.handleLoading(true);
      await this.getChildVariables();
      this.props.handleLoading(false);
    });

  }

  async getChildVariables() {
    for (let x = 0; x < this.state.charts.length; x++) {
      let chartName = this.state.charts[x];
      await this.refs["h" + x].getVariables(chartName, this.state.chartVersions[chartName]);
    }
  }

  constructor(props) {
    super(props);
    const values = queryString.parse(props.location.search);
    this.state.envId = values.environment;
  }

  onSave = (payload) => {
    multipleInstall(payload, this);
  }

  onSaveVariablesClick = () => {
    this.props.handleLoading(true);
    this.state.charts.forEach((item, key) => {
      this.refs["h" + key].save((data) => { });
    });
    this.props.handleLoading(false);
  }

  onClick = () => {

    let payload = { deployables: [] };
    let count = 0;
    const totalCharts = this.state.charts.length;

    this.state.charts.forEach((item, key) => {
      this.refs["h" + key].save((list) => {
        for (let x = 0; x < list.length; x++) {
          let data = list[x];
          payload.deployables.push(data);
        }
        count++;
        if (count === totalCharts) {
          this.onSave(payload);
        }
      });

    });



  }

  render() {

    const envId = this.state.envId;
    const items = this.state.charts.map((item, key) => {
      return (
        <HelmVariables handleLoading={this.props.handleLoading}
          handleNotification={this.props.handleNotification}
          key={key} chartName={item} chartVersion={this.state.chartVersions[item]}
          ref={"h" + key}
          envId={envId} />
      )

    }



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

                    <ButtonToolbar>

                      <Button bsStyle="primary"
                        fill
                        pullRight
                        type="button"
                        onClick={this.onClick}
                      >Install/Update</Button>

                      <Button bsStyle="info"
                        fill
                        pullRight
                        type="button"
                        onClick={this.onSaveVariablesClick}
                      >Save Variables</Button>

                    </ButtonToolbar>

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
