import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  FormGroup,
  FormControl,
  FormLabel,
  Card,
  Form
} from 'react-bootstrap';

import Select from 'react-select';
import { ActionCard } from 'components/Card/ActionCard.jsx';

import { getDefaultRepo } from 'client-api/apicall.jsx';
import ChartCard from 'components/Card/ChartCard.jsx';

import axios from 'axios';
import { TENKAI_API_URL } from 'env.js';

class Deployment extends Component {
  state = {
    inputFilter: '',
    chartsResult: { charts: [] },
    repositories: [],
    selectedRepository: {},
    latestVersionOnly: true
  };

  componentDidMount() {
    this.props.updateSelectedChartsToDeploy([]);
    this.getRepos();
  }

  handleRepositoryChange = selectedRepository => {
    this.setState({ selectedRepository });
    this.getCharts(selectedRepository.value);
  };

  getRepos() {
    axios
      .get(TENKAI_API_URL + '/repositories')
      .then(response => {
        var arr = [];
        for (var x = 0; x < response.data.repositories.length; x++) {
          var element = response.data.repositories[x];
          arr.push({ value: element.name, label: element.name });
        }
        this.setState({ repositories: arr }, () => {
          getDefaultRepo(this, self => {
            for (let x = 0; x < this.state.repositories.length; x++) {
              if (self.state.repositories[x].value === self.state.defaultRepo) {
                self.handleRepositoryChange(this.state.repositories[x]);
                break;
              }
            }
          });
        });
      })
      .catch(error => {
        console.log(error.message);
        this.props.handleNotification('general_fail', 'error');
      });
  }

  getCharts(repo) {
    this.props.handleLoading(true);

    let url = '/charts/' + repo + '?all=' + !this.state.latestVersionOnly;

    axios
      .get(TENKAI_API_URL + url)
      .then(response => {
        this.setState({
          chartsResult:
            response.data.charts != null ? response.data : { charts: [] }
        });
        this.props.handleLoading(false);
      })
      .catch(error => {
        this.props.handleLoading(false);
        console.log(error.message);
        this.props.handleNotification('general_fail', 'error');
      });
  }

  navigateToCheckVariables() {
    this.props.history.push({
      pathname: '/admin/deployment-wvars'
    });
  }

  navigateToDependencyAnalysis() {
    this.props.history.push({
      pathname: '/admin/deployment-depanalysis'
    });
  }

  handleLatestVersionOnlyChange(e) {
    this.setState({ latestVersionOnly: e.target.checked }, () => {
      if (
        this.state.selectedRepository !== undefined &&
        this.state.selectedRepository.value !== undefined
      ) {
        this.getCharts(this.state.selectedRepository.value);
      }
    });
  }

  addToDeployList(item) {
    let array = this.props.selectedChartsToDeploy;
    let index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    } else {
      array.push(item);
    }
    this.props.updateSelectedChartsToDeploy(array);
  }

  handleCheckboxChange(e) {
    const item = e.target.name;

    let array = this.props.selectedChartsToDeploy;
    let index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    } else {
      array.push(item);
    }
    this.props.updateSelectedChartsToDeploy(array);
  }

  onChangeInputHandler(e) {
    this.setState({
      inputFilter: e.target.value
    });
  }

  deployUnit(item) {
    let array = [];
    array.push(item);
    this.props.updateSelectedChartsToDeploy(array, () => {
      this.props.history.push({
        pathname: '/admin/deployment-wvars'
      });
    });
  }

  analysisUnit(item) {
    let array = [];
    array.push(item);
    this.props.updateSelectedChartsToDeploy(array, () => {
      this.props.history.push({
        pathname: '/admin/deployment-depanalysis'
      });
    });
  }

  canary(item) {
    let array = [];
    array.push(item);
    this.props.updateSelectedChartsToDeploy(array, () => {
      this.props.history.push({
        pathname: '/admin/deployment-wvars',
        search: '?canary=true'
      });
    });
  }

  render() {
    const { selectedRepository } = this.state;

    const multipleDeployList = this.props.selectedChartsToDeploy.map(
      (item, key) => (
        <span key={key} className="badge badge-primary left-space">
          {item}
        </span>
      )
    );

    const items = this.state.chartsResult.charts
      .filter(
        d =>
          this.state.inputFilter === '' ||
          d.name.includes(this.state.inputFilter)
      )
      .map(item => (
        <ChartCard
          key={item.name}
          item={item}
          selectedChartsToDeploy={this.props.selectedChartsToDeploy}
          handleCheckboxChange={this.handleCheckboxChange.bind(this)}
          addToDeployList={this.addToDeployList.bind(this)}
          deploy={this.deployUnit.bind(this)}
          analysis={this.analysisUnit.bind(this)}
          canary={this.canary.bind(this)}
        />
      ));

    return (
      <div className="content">
        <Container fluid>
          <Row>
            <Col md={12}>
              <ActionCard
                buttonsDisabled={
                  (Object.entries(this.props.selectedEnvironment).length ===
                    0 &&
                    this.props.selectedEnvironment.constructor === Object) ||
                  this.props.selectedChartsToDeploy.length <= 0
                }
                directDeployOnClick={this.navigateToCheckVariables.bind(
                  this,
                  this
                )}
                analyseOnClick={this.navigateToDependencyAnalysis.bind(this)}
                title="Helm Chart"
                content={
                  <div>
                    <Row>
                      <Col xs={2}>
                        <FormGroup>
                          <FormLabel>Repository</FormLabel>
                          <Select
                            value={selectedRepository}
                            onChange={this.handleRepositoryChange}
                            options={this.state.repositories}
                          />
                        </FormGroup>
                      </Col>

                      <Col xs={8}>
                        <FormGroup>
                          <FormLabel>Chart Search</FormLabel>
                          <FormControl
                            ref="inputNode"
                            name="inputFilter"
                            value={this.state.inputFilter}
                            onChange={this.onChangeInputHandler.bind(this)}
                            style={{ width: '100%' }}
                            type="text"
                            placeholder="Search using any field"
                            aria-label="Search using any field"
                          ></FormControl>
                        </FormGroup>
                      </Col>

                      <Col xs={2}>
                        <FormGroup>
                          <FormLabel>Latest chart only</FormLabel>
                          <Form.Check
                            id="latestVersionOnly"
                            type="switch"
                            checked={this.state.latestVersionOnly === true}
                            onChange={this.handleLatestVersionOnlyChange.bind(
                              this
                            )}
                            label=""
                          ></Form.Check>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={12}>
                        <Card>
                          <Card.Header>
                            Multiple deployment selection
                          </Card.Header>
                          <Card.Body>{multipleDeployList}</Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={12}>
                        <Card variant="primary">
                          <Card.Header>
                            <Card.Title as="h4">Charts</Card.Title>
                          </Card.Header>
                          <Card.Body>{items}</Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                }
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Deployment;
