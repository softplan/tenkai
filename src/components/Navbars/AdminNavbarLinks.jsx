import React, { Component } from "react";
import { Nav, Navbar, NavDropdown, MenuItem, FormGroup, Button, NavItem, FormControl } from "react-bootstrap";
import Select from 'react-select';

class AdminNavbarLinks extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      id: "",
      selectedOption: {},
    };
    if (this.props.keycloak !== undefined) {
      this.props.keycloak.loadUserInfo().then(userInfo => {
          this.setState({name: userInfo.name, email: userInfo.email, id: userInfo.sub})
      });
    }
  }  


  logout() {
    this.props.history.push('/')
    this.props.keycloak.logout();
  }

  render() {

    return (
      <div>
        <Navbar.Text>
          Environment:
        </Navbar.Text>
        <Nav>
          <Navbar.Form style={{ width: "200px", marginTop: "8px"}} pullLeft>
            <Select value={this.props.selectedEnvironment} onChange={this.props.handleEnvironmentChange} options={this.props.environments} />
          </Navbar.Form>
        </Nav>
        {this.props.selectedEnvironment && this.props.selectedEnvironment.productVersion &&
          <Navbar.Text>
            Product Version: {this.props.selectedEnvironment.productVersion}
          </Navbar.Text>
        }
        <Nav pullRight>
          <NavDropdown
            eventKey={2}
            title={this.state.name}
            id="basic-nav-dropdown-right"
          >
            <MenuItem eventKey={2.1} onClick={() => this.logout()}>Logout</MenuItem>
          </NavDropdown>
        </Nav>
      </div>
    );
  }
}

export default AdminNavbarLinks;
