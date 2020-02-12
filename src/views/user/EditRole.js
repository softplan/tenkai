import React, { Component } from 'react';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import { Button, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import * as services from 'services/securityOperation';

export class EditRole extends Component {
  state = {
    email: '',
    envs: [],
    roles: [],
    selectEnvironment: -1,
    selectedRole: {}
  };

  async componentDidMount() {
    const allRoles = await services.load();
    console.log(allRoles);

    let envs = this.props.editItem.Environments.map(e => ({
      label: e.name,
      value: e.ID
    }));

    let roles = allRoles.data.list.map(e => ({
      label: e.name,
      value: e.ID
    }));
    const email = this.props.email;
    this.setState({ envs: envs, roles: roles, email: email });
  }

  handleChangeEnv = selected => {
    const { value } = selected;

    this.setState(state => ({
      selectEnvironment: value
    }));
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
                      value={this.state.selectRole}
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
