import React, { Component } from 'react';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import { Button, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import * as services from 'services/securityOperation';
import * as roleServices from 'services/roles';

export class EditRole extends Component {
  state = {
    userId: -1,
    email: '',
    envs: [],
    roles: [],
    selectEnvironment: -1,
    selectedRole: {}
  };

  async componentDidMount() {
    const allRoles = await services.load();

    let envs = this.props.editItem.Environments.map(e => ({
      label: e.name,
      value: e.ID
    }));

    let roles = [];

    roles.push({
      label: '',
      value: -1
    });

    let tmpRoles = allRoles.data.list.map(e => ({
      label: e.name,
      value: e.ID
    }));

    roles.push(...tmpRoles);

    const email = this.props.editItem.email;
    const userId = this.props.editItem.ID;
    this.setState({ envs: envs, roles: roles, email: email, userId: userId });
  }

  async defineCurrentPolicy(environmentId) {
    let result = await roleServices.getUserPolicyByEnvironment({
      email: this.state.email,
      environmentId: environmentId
    });

    if (result.data !== null) {
      for (let x = 0; x < this.state.roles.length; x++) {
        if (this.state.roles[x].value === result.data.ID) {
          console.log(this.state.roles[x]);
          this.setState(state => ({
            selectedRole: this.state.roles[x]
          }));

          break;
        }
      }
    } else {
      this.setState(state => ({
        selectedRole: this.state.roles[0]
      }));
    }
  }

  handleChangeEnv = selected => {
    const { value } = selected;

    this.setState(state => ({
      selectEnvironment: value
    }));

    this.defineCurrentPolicy(value);
  };

  handleChangeRole = selected => {
    this.setState(state => ({
      selectedRole: selected
    }));
  };

  saveClick = event => {
    event.preventDefault();
    this.props.saveClick(this.state);
  };

  render() {
    return (
      <div>
        <CardTenkai
          title="User Role by Environment"
          content={
            <form>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      readOnly
                      type="text"
                      value={this.props.editItem.email}
                      name="email"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group controlId="environments">
                    <Form.Label>Environment</Form.Label>
                    <Select
                      onChange={this.handleChangeEnv.bind(this)}
                      options={this.state.envs}
                      className="react-select-zindex-3"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group controlId="roles">
                    <Form.Label>Role</Form.Label>
                    <Select
                      value={this.state.selectedRole}
                      onChange={this.handleChangeRole.bind(this)}
                      options={this.state.roles}
                      className="react-select-zindex-3"
                    />
                  </Form.Group>
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

export default EditRole;
