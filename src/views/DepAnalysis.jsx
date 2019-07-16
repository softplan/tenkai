import React, { Component } from "react";
import {
  Table, Grid, Row, Col, FormGroup
} from "react-bootstrap";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import queryString from 'query-string';
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
    const values = queryString.parse(props.location.search);
    this.state.envId = values.environment;
    this.state.environmentName = this.props.location.state.environment;
    
  }

  componentDidMount() {
    let total = this.props.location.state.charts.length;
    let helmCharts = [];
    let chartVersions = new Map();
    let value = "";
    let chartVersion = "";
    for (let i = 0; i < total; i++) {
      value = this.props.location.state.charts[i].substring(0, this.props.location.state.charts[i].indexOf("@"))
      chartVersion = this.props.location.state.charts[i].substring(this.props.location.state.charts[i].indexOf("@") + 1, this.props.location.state.charts[i].length)
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
                    <h3>Environment: {this.props.location.state.environment}</h3>
                    <Button bsStyle="info"
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
