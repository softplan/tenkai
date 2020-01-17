import React, { Component } from 'react';
import Select from 'react-select';
import { Button, Row, Col, Card, Form } from 'react-bootstrap';

export default class CompareEnvFilter extends Component {
  render() {
    return (
      <Card>
        <Card.Header as="h5">Filter</Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="srcEnv">
                  <Form.Label>Source environment</Form.Label>
                  <Select
                    value={this.props.selectedSrcEnv}
                    onChange={this.props.handleSrcEnvChange}
                    options={this.props.environments}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="tarEnv">
                  <Form.Label>Target environment</Form.Label>
                  <Select
                    value={this.props.selectedTarEnv}
                    onChange={this.props.handleTarEnvChange}
                    options={this.props.environments}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" onClick={this.props.handleCompare}>
              Compare
            </Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}
