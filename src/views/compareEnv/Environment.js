import React, { Component } from 'react';
import Select from 'react-select';
import { Row, Col, Card, Form } from 'react-bootstrap';

export default class Environment extends Component {
  render() {
    const state = this.props.state;
    return (
      <Card>
        <Card.Body>
          <Form>
            <Row>
              <Col md={2}>
                <Form.Group controlId="srcEnv">
                  <Form.Label>Compare Env Query</Form.Label>
                  <Select
                    value={state.selectedCompareEnvQuery}
                    onChange={this.props.selectCompareEnvQuery}
                    options={state.compareEnvQueries}
                    className="react-select-zindex-3"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="srcEnv">
                  <Form.Label>Source environment</Form.Label>
                  <Select
                    value={state.selectedSrcEnv}
                    onChange={this.props.selectSourceEnv}
                    options={state.environments}
                    className="react-select-zindex-3"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="tarEnv">
                  <Form.Label>Target environment</Form.Label>
                  <Select
                    value={state.selectedTarEnv}
                    onChange={this.props.selectTargetEnv}
                    options={state.environments}
                    className="react-select-zindex-3"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}
