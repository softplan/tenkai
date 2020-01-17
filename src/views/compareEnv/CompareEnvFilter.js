import React, { Component } from 'react';
import Select from 'react-select';
import {
  Button,
  Row,
  Col,
  Card,
  Form,
  Accordion,
  ToggleButtonGroup,
  ToggleButton,
  FormLabel,
  FormGroup
} from 'react-bootstrap';

export default class CompareEnvFilter extends Component {
  handleFilterChartChange = val => {

  };

  render() {
    return (
      <Card>
        <Card.Body>
          <Form>
            <Row>
              <Col md={12}>
                <Accordion defaultActiveKey="0">
                  <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                      Filter by charts
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                      <Card.Body>
                        <ToggleButtonGroup
                          type="checkbox"
                          value={this.props.filterChartType}
                          onChange={this.handleFilterChartChange}
                        >
                          <ToggleButton value={1}>Only Charts</ToggleButton>
                          <ToggleButton value={2}>Except Charts</ToggleButton>
                        </ToggleButtonGroup>

                        <FormGroup>
                          <FormLabel>Repository</FormLabel>
                          <Select
                            value={this.props.selectedRepository}
                            onChange={this.props.handleRepositoryChange}
                            options={this.props.repositories}
                          />
                        </FormGroup>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </Col>
            </Row>
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
