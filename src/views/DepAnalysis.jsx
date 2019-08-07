import React, { Component } from "react";
import {
  Table, Grid, Row, Col, FormGroup
} from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import Select from 'react-select';
import { retrieveReleasesWithCallBack } from 'client-api/apicall.jsx';

class DepAnalysis extends Component {

  state = {
    charts: [],
    chartVersions: new Map(),
    selectedVersion: new Map(),
    releases: new Map(),
  }

  constructor(props) {
    super(props);
    this.state.envId = this.props.selectedEnvironment.value;
    this.state.environmentName = this.props.selectedEnvironment.label;
  }

  componentDidMount() {
    
    let chartsToDeploy = this.props.selectedChartsToDeploy;
    let total = chartsToDeploy.length;

    let helmCharts = [];
    let chartVersions = new Map();
    let value = "";
    let chartVersion = "";
    for (let i = 0; i < total; i++) {
      value = chartsToDeploy[i].substring(0, chartsToDeploy[i].indexOf("@"))
      chartVersion = chartsToDeploy[i].substring(chartsToDeploy[i].indexOf("@") + 1, chartsToDeploy.length)
      helmCharts.push(value);
      this.getReleases(value);
      chartVersions[value] = chartVersion;
    }
    this.setState({ charts: helmCharts, chartVersions: chartVersions });
  }

  getReleases(chartName) {
    retrieveReleasesWithCallBack(chartName, this, function(chartName, result, self) {
      if (result !== undefined && result.length > 0) {
        let list = [];
        for (let x = 0; x < result.length; x++) {
          list.push({label: result[x].release, value: result[x].release});
        }
       self.setState({releases: {...self.state.releases, [chartName]:list}});
      }
    });
  }

  handleVersionChange = (chartName,selected) => {
    this.setState({selectedVersion: {...this.state.selectedVersion, [chartName]:selected}});
  }

  onClick() {
    this.props.history.push({
      pathname: "/admin/deployment-depgraph",
      search: "?environment=" + this.state.envId,
      state: { charts: this.state.selectedVersion, environmentName: this.state.environmentName }
    });
  }

  render() {

    const items = this.state.charts.map((item, key) =>

      <tr key={key} >
        <td>{item}</td>
        <td>{this.state.chartVersions[item]}</td>
        <td>
          <FormGroup>
            <Select value={this.state.selectedVersion[item]} onChange={this.handleVersionChange.bind(this, item)} options={this.state.releases[item]} />
          </FormGroup>
        </td>
      </tr>
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

                    <Button bsStyle="info"
                      disabled={(Object.entries(this.state.selectedVersion).length === 0 &&
                        this.state.selectedVersion.constructor === Object) || this.state.charts.length <= 0}
                    
                      fill
                      pullRight
                      type="button"
                      onClick={this.onClick.bind(this)}>Analyse</Button>
                    <div className="clearfix" />
                  </div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Card title="Charts" content={<div>

                <Table bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Helm Chart</th>
                      <th>Chart Version</th>
                      <th>Release Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items}
                  </tbody>
                </Table>

              </div>} />
            </Col>
          </Row>


        </Grid>
      </div>

    )

  }

}

export default DepAnalysis;
