import React, { Component } from 'react';
import Select from 'react-select';
import {
  Row,
  Col,
  Card,
  Form,
  ToggleButtonGroup,
  ToggleButton,
  FormLabel,
  FormGroup,
  Badge
} from 'react-bootstrap';

export default class ChartFilter extends Component {
  render() {
    const state = this.props.state;

    const badges = state.selectedCharts.map((v, k) => {
      return (
        <Badge
          key={k}
          pill
          variant="primary"
          onClick={() => this.props.removeChart(v)}
        >
          {v}
        </Badge>
      );
    });
    return (
      <Card>
        <Card.Body>
          <Form>
            <Card>
              <Card.Header>Filter by charts</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={12}>
                    <ToggleButtonGroup
                      name="radio"
                      type="radio"
                      value={state.filterOnlyExceptChart}
                      onChange={this.props.handleFilterChartChange}
                    >
                      <ToggleButton name="radio" value={0}>
                        None
                      </ToggleButton>
                      <ToggleButton name="radio" value={1}>
                        Only Charts
                      </ToggleButton>
                      <ToggleButton name="radio" value={2}>
                        Except Charts
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Col>
                </Row>
                {state.filterOnlyExceptChart > 0 && (
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <FormLabel>Repository</FormLabel>
                        <Select
                          value={this.props.selectedRepository}
                          onChange={this.props.handleRepositoryChange}
                          options={state.repositories}
                          className="react-select-zindex-2"
                        />
                      </FormGroup>
                    </Col>
                    <Col md={8}>
                      <FormGroup>
                        <FormLabel>Chart</FormLabel>
                        <Select
                          value={null}
                          onChange={this.props.addChart}
                          options={state.charts}
                          className="react-select-zindex-2"
                        />
                      </FormGroup>
                      {badges}
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}
