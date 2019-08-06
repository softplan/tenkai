import React, { Component } from "react";
import { Nav, NavDropdown, MenuItem } from "react-bootstrap";


class AdminNavbarLinks extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      id: ""
    };
    this.props.keycloak.loadUserInfo().then(userInfo => {
        this.setState({name: userInfo.name, email: userInfo.email, id: userInfo.sub})
    });
  }  

  logout() {
    this.props.history.push('/')
    this.props.keycloak.logout();
  }

  render() {
    return (
      <div>

        <Nav pullRight>
        <NavDropdown
            eventKey={2}
            title={this.state.name}
            id="basic-nav-dropdown-right"
          >
            <MenuItem eventKey={2.1} onClick={ () => this.logout()}>Logout</MenuItem>
          </NavDropdown>          
        </Nav>
      </div>
    );
  }
}

export default AdminNavbarLinks;
