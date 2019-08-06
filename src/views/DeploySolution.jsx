import React, { Component } from "react";
import {
  Grid, Row, Col, FormGroup, ControlLabel, Table, ButtonToolbar
} from "react-bootstrap";


import Select from 'react-select';
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import queryString from 'query-string';
import { retrieveSolutionChart } from 'client-api/solutionchart-apicall.jsx';


import axios from 'axios';

import TENKAI_API_URL from 'env.js';


class DeploySolution extends Component {


  constructor(props) {
    super(props);
    const values = queryString.parse(props.location.search);
    this.state = {
      solutionId: values.solutionId,
      list: [],
      chartsResult: { charts: [] },
      solutionName: "",
      selectedOption: {},
      environmentList: [],
    }
  }

  componentDidMount() {
    this.getEnvironments();
    retrieveSolutionChart(this.state.solutionId, this, async function(self) {
        self.props.handleLoading(true);
        for (let x = 0; x < self.state.list.length; x++) {
          let keyword = self.state.list[x].chartName.substr(self.state.list[x].chartName.indexOf("/")+1)
          await self.getChartsAsync(keyword);
        }
        self.props.handleLoading(false);
        
    });
  }

  //TODO - CREATE AN ENDPOINT THAT RECEIVE A POST AND ALL REQUESTS SIMULTANEOUS
  async getChartsAsync(searchTerm) {
        let url = "/charts/" + searchTerm + "?all=false";
        
        await axios.get(TENKAI_API_URL + url).then(response => {
            if (response.data.charts != null) {
                let array = this.state.chartsResult.charts;
                let responseArray = response.data.charts;
                
                for (let x = 0; x < responseArray.length; x++) {
                    array.push(responseArray[x]);
                }
                this.setState({chartsResult: {charts: array}});    
                
            }
        }).catch(error => {
            console.log(error.message);
            this.props.handleNotification("general_fail", "error");
        });
    }


  handleEnvironmentChange = (selectedOption) => {
    this.setState({ selectedOption });
  }


  getEnvironments() {
    axios.get(TENKAI_API_URL + '/environments')
      .then(response => {

        var arr = [];
        for (var x = 0; x < response.data.Envs.length; x++) {
          var element = response.data.Envs[x];
          arr.push({ value: element.ID, label: element.name });
        }
        this.setState({ environmentList: arr });


      })
      .catch(error => {
        console.log(error.message);
        this.props.handleNotification("general_fail", "error");
    });
  }


  navigateToCheckVariables(charts, selected) {

    let selectedCharts = [];
    for (let x=0; x < charts.length; x++) {
      selectedCharts.push(charts[x].name + "@" + charts[x].chartVersion);
    }

    this.props.history.push({
      pathname: "/admin/deployment-wvars",
      search: "?environment=" + selected.value,
      state: { charts: selectedCharts, environment: selected.label }
    });

  }


  render() {

    const { selectedOption } = this.state;

    const items = this.state.chartsResult.charts
      .map((item, key) =>
        <tr key={key} >
          <td>{item.name}</td>
          <td>{item.chartVersion}</td>
          <td>{item.appVersion}</td>
          <td>{item.description}</td>
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

                    <Row>
                      <div className="col-md-5">
                        <FormGroup>
                          <ControlLabel>Environment</ControlLabel>
                          <Select value={selectedOption} onChange={this.handleEnvironmentChange} options={this.state.environmentList} />
                        </FormGroup>

                      </div>

                    </Row>

                    <div className="clearfix" />
                  </div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>

              <Card
                title="Helm Chart"
                content={
                  <div>
      
                    <Row>
                    <div className="col-md-11">
                      <Table bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>Helm Chart</th>
                            <th>Version</th>
                            <th>App Version</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items}
                        </tbody>
                      </Table>

                    </div>
                    </Row>

                    <Row>
                      <Col xs={10}>
                    <ButtonToolbar>

                      <Button bsStyle="default"
                        disabled={(Object.entries(this.state.selectedOption).length === 0 &&
                          this.state.selectedOption.constructor === Object) || this.state.chartsResult.charts.length <= 0}
                        fill type="button"
                        onClick={this.navigateToCheckVariables.bind(this, this.state.chartsResult.charts, this.state.selectedOption)}>
                        Direct Deploy
                      </Button>

                    </ButtonToolbar>
                    </Col>
                    </Row>

                  </div>
                }
              />
            </Col>
          </Row>

        </Grid>
      </div>
    );
  }
}

export default DeploySolution;
