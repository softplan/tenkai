import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';

import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import TenkaiTable from 'components/Table/TenkaiTable';

import * as col from 'components/Table/TenkaiColumn';
import * as actions from 'stores/deploy/actions';
import * as selectors from 'stores/deploy/reducer';
import Select from 'react-select';
import { Card, Button, FormGroup, FormLabel } from 'react-bootstrap';

export class Deploy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEnvironments: this.getEnvs()
    };
  }

  isMultiEnvDeployment() {
    return this.props.deploy.deployType === 'MULTI_ENV';
  }

  getEnvs() {
    if (this.isMultiEnvDeployment()) {
      return this.props.deploy.selectedEnvironments;
    }
    return [];
  }

  onDeploy() {
    let payload = this.createDeployPayload();
    this.props.dispatch(actions.deploy(payload));
  }

  getEnvironmentIds() {
    if (this.isMultiEnvDeployment()) {
      return this.props.deploy.selectedEnvironments.map(e => e.value);
    } else {
      return this.state.selectedEnvironments.map(e => e.value);
    }
  }

  createDeployPayload() {
    return {
      productVersionId: this.props.deploy.productVersionId,
      environmentIds: this.getEnvironmentIds(),
      deployables: this.props.deploy.chartsToDeploy.map(c => ({
        environmentId: this.state.selectedEnvironments[0].value,
        chart: c.chartName,
        chartVersion: c.chartVersion,
        name: this.getChartName(c.chartName)
      }))
    };
  }

  getChartName(name) {
    let splited = name.split('/');
    if (splited.length > 0) {
      return splited[1];
    }
    return name;
  }

  handleEnvironmentChange = selectedEnvironments => {
    this.setState({ selectedEnvironments });
  };

  render() {
    let columns = [];
    columns.push(col.addCol('chartName', 'Chart Name'));
    columns.push(col.addCol('chartVersion', 'Chart Version'));
    columns.push(col.addCol('dockerTag', 'Docker Tag'));

    let data = [];
    if (
      this.props.deploy !== undefined &&
      this.props.deploy.chartsToDeploy !== undefined
    ) {
      data = this.props.deploy.chartsToDeploy;
    }

    return (
      <div className="content">
        <Container fluid>
          <Row>
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <FormLabel>Environments</FormLabel>
                        <Select
                          value={this.state.selectedEnvironments}
                          onChange={this.handleEnvironmentChange}
                          options={this.props.environments}
                          className="react-select-zindex-4"
                          isMulti
                          closeMenuOnSelect={false}
                          isDisabled={this.isMultiEnvDeployment()}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={8}>
                      <Button
                        variant="primary"
                        className="pull-right"
                        onClick={this.onDeploy.bind(this)}
                      >
                        Request Install
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <CardTenkai
                title="Charts to Deploy"
                content={
                  <form>
                    <TenkaiTable
                      keyfield="chartName"
                      columns={columns}
                      data={data}
                    />
                  </form>
                }
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  deploy: selectors.getDeploy(state)
});

export default connect(mapStateToProps)(Deploy);
