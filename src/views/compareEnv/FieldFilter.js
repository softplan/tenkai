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
  Badge,
  Button
} from 'react-bootstrap';

export default class FieldFilter extends Component {
  render() {
    const state = this.props.state;

    const badges = state.selectedFields.map((v, k) => {
      return (
        <Badge
          key={k}
          pill
          variant="primary"
          onClick={() => this.props.removeField(v)}
        >
          {v}
        </Badge>
      );
    });

    const badgesCustom = state.customFields.map((v, k) => {
      return (
        <Badge
          key={k}
          pill
          variant="primary"
          onClick={() => this.props.removeCustomField(v)}
        >
          {v.filterType}: {v.filterValue}
        </Badge>
      );
    });

    const renderOnlyFields =
      state.filterOnlyExceptField > 0 && state.filterOnlyExceptField < 3;
    const renderCustomFilter = state.filterOnlyExceptField === 3;

    return (
      <Card>
        <Card.Body>
          <Form>
            <Card>
              <Card.Header>Filter by fields</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={12}>
                    <ToggleButtonGroup
                      name="radio"
                      type="radio"
                      value={state.filterOnlyExceptField}
                      onChange={this.props.handleFilterFieldChange}
                    >
                      <ToggleButton name="radio" value={0}>
                        None
                      </ToggleButton>
                      <ToggleButton name="radio" value={1}>
                        Only Fields
                      </ToggleButton>
                      <ToggleButton name="radio" value={2}>
                        Except Fields
                      </ToggleButton>
                      <ToggleButton name="radio" value={3}>
                        Custom Filter
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Col>
                </Row>
                {renderOnlyFields && (
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <FormLabel>Fields</FormLabel>
                        <Select
                          value={null}
                          onChange={this.props.addField}
                          options={state.fields}
                          className="react-select-zindex-2"
                        />
                      </FormGroup>
                      {badges}
                    </Col>
                  </Row>
                )}
                {renderCustomFilter && (
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <FormLabel>Filter type</FormLabel>
                        <Select
                          value={state.selectedFilterFieldType}
                          onChange={this.props.selectFilterFieldType}
                          options={state.filterFields}
                          className="react-select-zindex-2"
                        />
                      </FormGroup>
                      {badges}
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Field Expression</Form.Label>
                        <Form.Control
                          type="text"
                          onChange={this.props.fieldFilterExp}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Button
                        style={{ marginTop: '25px' }}
                        variant="primary"
                        onClick={this.props.addFilterField}
                      >
                        Add
                      </Button>
                    </Col>
                    {badgesCustom}
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
