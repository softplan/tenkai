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
                    </ToggleButtonGroup>
                  </Col>
                </Row>
                {state.filterOnlyExceptField > 0 && (
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <FormLabel>Fields</FormLabel>
                        <Select
                          value={null}
                          onChange={this.props.addField}
                          options={state.fields}
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
