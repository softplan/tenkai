import React, { Component } from 'react';
import DualListBox from 'react-dual-listbox';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { getAllEnvironments } from 'client-api/apicall.jsx';
import * as utils from 'utils/sort';

export class UserForm extends Component {
  state = {
    formData: { checkedEnvs: [], email: '' },
    envs: [],
    selected: []
  };

  componentDidMount() {
    if (this.props.editMode) {
      let selected = this.props.editItem.Environments.map(e => e.name);
      this.setState({ formData: this.props.editItem, selected: selected });
    } else {
      this.setState(() => ({
        formData: { checkedEnvs: [], email: '' }
      }));
    }
    getAllEnvironments(this, envs => {
      this.setState({ envs: envs.map(e => ({ ID: e.ID, name: e.name })) });
    });
  }

  handleChange = event => {
    const { value, name } = event.target;
    this.setState(state => ({
      formData: { ...state.formData, [name]: value }
    }));
  };

  saveClick = event => {
    event.preventDefault();

    let ids = this.state.selected.map(s => {
      return this.state.envs.find(e => e.name === s).ID;
    });

    this.setState(
      { formData: { ...this.state.formData, checkedEnvs: ids } },
      () => {
        this.props.saveClick(this.state.formData);
      }
    );
  };

  onChangeDualList = selected => this.setState({ selected: selected });

  render() {
    const { editMode } = this.props;
    const options = [...(this.state.envs || [])]
      .sort((a, b) => utils.sort(a.name, b.name))
      .map(e => ({
        value: e.name,
        label: e.name
      }));

    return (
      <div>
        <CardTenkai
          title={editMode ? 'Edit User' : 'New User'}
          content={
            <form>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={this.handleChange}
                      value={this.state.formData.email}
                      name="email"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <h4>Environments</h4>
              <Row>
                <Col>
                  <DualListBox
                    options={options}
                    selected={this.state.selected}
                    onChange={this.onChangeDualList}
                    canFilter
                  />
                </Col>
              </Row>
              <Row>
                <Col style={{ marginTop: 10 }}>
                  <Button variant="primary" onClick={this.saveClick}>
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

export default UserForm;
