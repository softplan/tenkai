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
              <Col md={6}>
                <Form.Group controlId="srcEnv">
                  <Form.Label>Source environment</Form.Label>
                  <Select
                    value={state.selectedSrcEnv}
                    onChange={this.props.selectSourceEnv}
                    options={this.props.environments}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="tarEnv">
                  <Form.Label>Target environment</Form.Label>
                  <Select
                    value={state.selectedTarEnv}
                    onChange={this.props.selectTargetEnv}
                    options={this.props.environments}
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
