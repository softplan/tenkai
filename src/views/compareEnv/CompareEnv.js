import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import {
  Button,
  Container,
  Row,
  Col,
  Table,
  Card,
  Form
} from 'react-bootstrap';
import * as compareEnvActions from 'stores/compareEnv/actions';
import * as compareEnvSelectors from 'stores/compareEnv/reducer';

class CompareEnv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSrcEnv: {},
      selectedTarEnv: {}
    };
  }

  handleSrcEnvChange = selectedSrcEnv => {
    this.props.dispatch(
      compareEnvActions.selectSourceEnvironment(selectedSrcEnv)
    );
  };

  handleTarEnvChange = selectedTarEnv => {
    this.props.dispatch(
      compareEnvActions.selectTargetEnvironment(selectedTarEnv)
    );
  };

  handleCompare() {
    if (
      !!this.props.compareEnv.selectedSrcEnv &&
      !!this.props.compareEnv.selectedTarEnv
    ) {
      const payload = {
        sourceEnvId: this.props.compareEnv.selectedSrcEnv.value,
        targetEnvId: this.props.compareEnv.selectedTarEnv.value,
        exceptCharts: [],
        onlyCharts: [],
        exceptFields: [],
        onlyFields: []
      };
      this.props.dispatch(compareEnvActions.compareEnv(payload));
    }
  }

  compare = (a, b) => {
    const scopeA = a.sourceScope.toUpperCase();
    const scopeB = b.sourceScope.toUpperCase();
    const sourceNameA = a.sourceName.toUpperCase();
    const sourceNameB = b.sourceName.toUpperCase();

    if (scopeA > scopeB || sourceNameA > sourceNameB) {
      return 1;
    } 
    if (scopeA < scopeB || sourceNameA < sourceNameB) {
      return -1;
    }
    return 0;
  };

  render() {
    let srcEnvLabel = '';
    if (!!this.props.compareEnv.selectedSrcEnv) {
      srcEnvLabel = this.props.compareEnv.selectedSrcEnv.label.toUpperCase();
    }
    let tarEnvLabel = '';
    if (!!this.props.compareEnv.selectedTarEnv) {
      tarEnvLabel = this.props.compareEnv.selectedTarEnv.label.toUpperCase();
    }
    const items = this.props.compareEnv.envsDiff
      .sort(this.compare)
      .map((item, key) => (
        <tr key={key}>
          <td>{item.sourceScope}</td>
          <td>{item.sourceName}</td>
          <td>{item.sourceValue}</td>
          <td>{item.targetScope}</td>
          <td>{item.targetName}</td>
          <td>{item.targetValue}</td>
        </tr>
      ));
    return (
      <Container fluid>
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header as="h5">Filter</Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="srcEnv">
                        <Form.Label>Source environment</Form.Label>
                        <Select
                          value={this.props.compareEnv.selectedSrcEnv}
                          onChange={this.handleSrcEnvChange}
                          options={this.props.environments}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="tarEnv">
                        <Form.Label>Target environment</Form.Label>
                        <Select
                          value={this.props.compareEnv.selectedTarEnv}
                          onChange={this.handleTarEnvChange}
                          options={this.props.environments}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    variant="primary"
                    onClick={() => this.handleCompare()}
                  >
                    Compare
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header as="h5">
                Diff between source <strong>{srcEnvLabel}</strong> and target{' '}
                <strong>{tarEnvLabel}</strong>
              </Card.Header>
              <Table responsive striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>Source Scope</th>
                    <th style={{ width: '13%' }}>Source Variable Name</th>
                    <th style={{ width: '27%' }}>Source Variable Value</th>
                    <th style={{ width: '10%' }}>Target Scope</th>
                    <th style={{ width: '13%' }}>Target Variable Name</th>
                    <th style={{ width: '27%' }}>Target Variable Value</th>
                  </tr>
                </thead>
                <tbody>{items}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  compareEnv: compareEnvSelectors.getCompareEnv(state),
  loading: compareEnvSelectors.getLoading(state),
  error: compareEnvSelectors.getError(state)
});

export default connect(mapStateToProps)(CompareEnv);
