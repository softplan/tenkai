import React, { Component } from "react";
import {
  Grid, Row, Col, FormGroup, FormControl, ControlLabel
} from "react-bootstrap";


import Select from 'react-select';
import { ActionCard } from "components/Card/ActionCard.jsx";

import { getDefaultRepo } from 'client-api/apicall.jsx';
import ChartCard from 'components/Card/ChartCard.jsx';

import axios from 'axios';
import TENKAI_API_URL from 'env.js';

class Deployment extends Component {

  state = {
    inputFilter: "",
    chartsResult: { charts: [] },
    repositories: [],
    selectedRepository: {},
    latestVersionOnly: true,
  }

  componentDidMount() {
    this.props.updateSelectedChartsToDeploy([]);
    this.getRepos();
  }

  handleRepositoryChange = (selectedRepository) => {
    this.setState({ selectedRepository });
    this.getCharts(selectedRepository.value);
  }

  getRepos() {
    axios.get(TENKAI_API_URL + '/repositories')
      .then(response => {
        var arr = [];
        for (var x = 0; x < response.data.repositories.length; x++) {
          var element = response.data.repositories[x];
          arr.push({ value: element.name, label: element.name });
        }
        this.setState({ repositories: arr }, () => {
          getDefaultRepo(this, (self) => {
            for (let x = 0; x < this.state.repositories.length; x++) {
              if (self.state.repositories[x].value === self.state.defaultRepo) {
                self.handleRepositoryChange(this.state.repositories[x]);
                break;
              }
            }

          });
        });
      }).catch(error => {
        console.log(error.message);
        this.props.handleNotification("general_fail", "error");
      });
  }

  getCharts(repo) {
    this.props.handleLoading(true);

    let url = "/charts/" + repo + "?all=" + !this.state.latestVersionOnly;

    axios.get(TENKAI_API_URL + url).then(response => {
      this.setState({ chartsResult: response.data.charts != null ? response.data : { charts: [] } });
      this.props.handleLoading(false);
    }).catch(error => {
      this.props.handleLoading(false);
      console.log(error.message);
      this.props.handleNotification("general_fail", "error");
    });
  }

  navigateToCheckVariables() {
    this.props.history.push({
      pathname: "/admin/deployment-wvars"
    });
  }

  navigateToDependencyAnalysis() {
    this.props.history.push({
      pathname: "/admin/deployment-depanalysis"
    });
  }

  handleLatestVersionOnlyChange(e) {
    this.setState({ latestVersionOnly: e.target.checked }, () => {
      if (this.state.selectedRepository !== undefined && this.state.selectedRepository.value !== undefined) {
        this.getCharts(this.state.selectedRepository.value);
      }
    });
  }

  handleCheckboxChange(e) {

    const item = e.target.name;

    let array = this.props.selectedChartsToDeploy;
    let index = array.indexOf(item)
    if (index !== -1) {
      array.splice(index, 1);
    } else {
      array.push(item);
    }
    this.props.updateSelectedChartsToDeploy(array);
  }

  onChangeInputHandler(e) {
    this.setState({
      inputFilter: e.target.value,
    })
  }

  deployUnit(item) {
    let array = []
    console.log(item);
    array.push(item);
    this.props.updateSelectedChartsToDeploy(array, () => {
      this.props.history.push({
        pathname: "/admin/deployment-wvars"
      });
    });
  }

  analysisUnit(item) {
    let array = []
    console.log(item);
    array.push(item);
    this.props.updateSelectedChartsToDeploy(array, () => {
      this.props.history.push({
        pathname: "/admin/deployment-depanalysis"
      });
    });
  }

  canary(item) {
    let array = []
    array.push(item);
    this.props.updateSelectedChartsToDeploy(array, () => {
      this.props.history.push({
        pathname: "/admin/deployment-wvars",
        search: "?canary=true",
      });
    });
  }

  render() {

    const { selectedRepository } = this.state;

    const items = this.state.chartsResult.charts
      .filter(d => this.state.inputFilter === '' || d.name.includes(this.state.inputFilter)).map((item, key) =>
        <ChartCard key={item.name}
          item={item}
          selectedChartsToDeploy={this.props.selectedChartsToDeploy}
          handleCheckboxChange={this.handleCheckboxChange.bind(this)}
          deploy={this.deployUnit.bind(this)}
          analysis={this.analysisUnit.bind(this)}
          canary={this.canary.bind(this)}
        />
      );

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>

              <ActionCard 

                buttonsDisabled={(Object.entries(this.props.selectedEnvironment).length === 0 &&
                  this.props.selectedEnvironment.constructor === Object) || this.props.selectedChartsToDeploy.length <= 0}
                
                  directDeployOnClick={this.navigateToCheckVariables.bind(this, this)}
                analyseOnClick={this.navigateToDependencyAnalysis.bind(this)}
                
                title="Helm Chart"
                content={
                  <div>

                    <Row>
                      <div className="col-md-5">
                        <FormGroup>
                          <ControlLabel>Repository</ControlLabel>
                          <Select value={selectedRepository} onChange={this.handleRepositoryChange} options={this.state.repositories} />
                        </FormGroup>
                      </div>

                    </Row>

                    <Row>
                      <Col xs={4}>
                        <FormGroup>
                          <ControlLabel>Chart Search</ControlLabel>
                          <FormControl
                            value={this.state.inputFilter}
                            onChange={this.onChangeInputHandler.bind(this)}
                            style={{ width: '100%' }} type="text"
                            placeholder="Search using any field"
                            aria-label="Search using any field"></FormControl>
                        </FormGroup>
                      </Col>

                      <Col xs={3}>
                        <div className="custom-control custom-checkbox">
                          <input type="checkbox" className="custom-control-input"
                            id="latestVersionOnly" checked={this.state.latestVersionOnly === true}
                            onChange={this.handleLatestVersionOnlyChange.bind(this)} />
                          <label className="custom-control-label" htmlFor="latestVersionOnly">LATEST CHART VERSION ONLY</label>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={12}>
                         {items}
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

export default Deployment;
