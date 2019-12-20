import React, { Component } from 'react';
import { Container, Row, Col, Table, ButtonToolbar } from 'react-bootstrap';

import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import Button from 'components/CustomButton/CustomButton.jsx';
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
      solutionName: ''
    };
  }

  componentDidMount() {
    retrieveSolutionChart(this.state.solutionId, this, async function(self) {
      self.props.handleLoading(true);
      for (let x = 0; x < self.state.list.length; x++) {
        let keyword = self.state.list[x].chartName.substr(
          self.state.list[x].chartName.indexOf('/') + 1
        );
        await self.getChartsAsync(keyword);
      }
      self.props.handleLoading(false);
    });
  }

  //TODO - CREATE AN ENDPOINT THAT RECEIVE A POST AND ALL REQUESTS SIMULTANEOUS
  async getChartsAsync(searchTerm) {
    searchTerm = this.getChartName(searchTerm)

    let url = '/charts/' + searchTerm + '?all=false';

    await axios
      .get(TENKAI_API_URL + url)
      .then(response => {
        if (response.data.charts != null) {
          let array = this.state.chartsResult.charts;
          let responseArray = response.data.charts;

          for (let x = 0; x < responseArray.length; x++) {
            array.push(responseArray[x]);
          }
          this.setState({ chartsResult: { charts: array } });
        }
      })
      .catch(error => {
        console.log(error.message);
        this.props.handleNotification('general_fail', 'error');
      });
  }

  getChartName(chartNameVersion) {
    let splited = chartNameVersion.split(' - ');
    return splited.length >= 1 ? splited[0] : '';
  }

  navigateToCheckVariables(charts, selected) {
    this.props.updateSelectedChartsToDeploy([]);

    let selectedCharts = [];
    for (let x = 0; x < charts.length; x++) {
      selectedCharts.push(charts[x].name + '@' + charts[x].chartVersion);
    }

    this.props.updateSelectedChartsToDeploy(selectedCharts);

    this.props.history.push({
      pathname: '/admin/deployment-wvars'
    });
  }

  render() {
    const items = this.state.chartsResult.charts.map((item, key) => (
      <tr key={key}>
        <td>{item.name}</td>
        <td>{item.chartVersion}</td>
        <td>{item.appVersion}</td>
        <td>{item.description}</td>
      </tr>
    ));

    return (
      <div className="content">
        <Container fluid>
          <Row>
            <Col md={12}>
              <CardTenkai
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
                          <tbody>{items}</tbody>
                        </Table>
                      </div>
                    </Row>

                    <Row>
                      <Col xs={10}>
                        <ButtonToolbar>
                          <Button
                            variant="default"
                            disabled={
                              (Object.entries(this.props.selectedEnvironment)
                                .length === 0 &&
                                this.props.selectedEnvironment.constructor ===
                                  Object) ||
                              this.state.chartsResult.charts.length <= 0
                            }
                            fill
                            type="button"
                            onClick={this.navigateToCheckVariables.bind(
                              this,
                              this.state.chartsResult.charts,
                              this.props.selectedEnvironment
                            )}
                          >
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
        </Container>
      </div>
    );
  }
}

export default DeploySolution;
