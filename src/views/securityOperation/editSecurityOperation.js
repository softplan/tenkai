import React, { Component } from 'react';
import DualListBox from 'react-dual-listbox';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import { Button, Form, Row, Col } from 'react-bootstrap';
import security_policies from 'policies.js';

export class EditSecurityOperation extends Component {
  state = {
    formData: { policies: [], name: '' },
    policies: [],
    selected: [],
    allPolicies: []
  };

  componentDidMount() {
    let allPolicies = [];
    security_policies.forEach((v, key, map) => {
      const theLabel = key + ' - ' + v;
      allPolicies.push({ label: theLabel, value: key });
    });

    this.setState({ allPolicies: allPolicies });

    if (this.props.editMode) {
      let selected = this.props.editItem.Policies.map(e => e.name);
      this.setState({ formData: this.props.editItem, selected: selected });
    } else {
      this.setState(() => ({
        formData: { policies: [], name: '' }
      }));
    }
  }

  handleChange = event => {
    const { value, name } = event.target;
    this.setState(state => ({
      formData: { ...state.formData, [name]: value }
    }));
  };

  saveClick = event => {
    event.preventDefault();
    this.setState(
      { formData: { ...this.state.formData, policies: this.state.selected } },
      () => {
        this.props.saveClick(this.state.formData);
      }
    );
  };

  onChangeDualList = selected => this.setState({ selected: selected });

  render() {
    const { editMode } = this.props;
    return (
      <div>
        <CardTenkai
          title={editMode ? 'Edit Role' : 'New Role'}
          content={
            <form>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Role Name</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={this.handleChange}
                      value={this.state.formData.name}
                      name="name"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <h4>Policies</h4>
              <Row>
                <Col>
                  <DualListBox
                    options={this.state.allPolicies}
                    selected={this.state.selected}
                    onChange={this.onChangeDualList}
                    canFilter
                  />
                </Col>
              </Row>
              <Row>
                <Col style={{ marginTop: 10 }}>
                  <Button
                    variant="primary"
                    onClick={this.saveClick}
                    disabled={this.state.formData.name === ''}
                  >
                    Save
                  </Button>
                  <Button variant="secondary" onClick={this.props.cancelClick}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </form>
          }
        />
      </div>
    );
  }
}

export default EditSecurityOperation;
