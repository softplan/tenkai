import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown, Form } from 'react-bootstrap';
import Select from 'react-select';

class AdminNavbarLinks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      id: '',
      selectedOption: {}
    };
    if (this.props.keycloak !== undefined) {
      this.props.keycloak.loadUserInfo().then(userInfo => {
        this.setState({
          name: userInfo.name,
          email: userInfo.email,
          id: userInfo.sub
        });
      });
    }
  }

  logout() {
    this.props.history.push('/');
    this.props.keycloak.logout();
  }

  handleDropdown = eventKey => {
    if (eventKey === 'logout') {
      this.logout();
    }
  };

  render() {
    const renderVersion =
      this.props.selectedEnvironment &&
      this.props.selectedEnvironment.productVersion;

    return (
      <Navbar collapseOnSelect bg="light" expand="lg">
        <Nav>
          <Nav.Link href="#">Environment:</Nav.Link>
        </Nav>
        <Nav.Item style={{ width: '200px' }}>
          <Select
            value={this.props.selectedEnvironment}
            onChange={this.props.handleEnvironmentChange}
            options={this.props.environments}
            className="react-select-zindex-4"
          />
        </Nav.Item>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {renderVersion && (
              <Nav>
                <Nav.Link href="#">
                  Product Version:{' '}
                  {this.props.selectedEnvironment.productVersion}
                </Nav.Link>
              </Nav>
            )}
          </Nav>
          <Form inline>
            <NavDropdown
              onSelect={this.handleDropdown}
              title={this.state.name}
              id="basic-nav-dropdown-right"
            >
              <NavDropdown.Item eventKey="logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default AdminNavbarLinks;
