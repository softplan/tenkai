import React, { Component } from 'react';
import { Navbar, NavDropdown } from 'react-bootstrap';

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
    return (
      <Navbar collapseOnSelect bg="light" expand="lg">
        <Navbar.Brand href="#"></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
          <NavDropdown
            onSelect={this.handleDropdown}
            title={this.state.name}
            id="basic-nav-dropdown-right"
          >
            <NavDropdown.Item eventKey="logout">Logout</NavDropdown.Item>
          </NavDropdown>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default AdminNavbarLinks;
