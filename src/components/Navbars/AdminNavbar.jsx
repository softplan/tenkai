import React, { Component } from "react";
import AdminNavbarLinks from "./AdminNavbarLinks.jsx";

class Header extends Component {
  constructor(props) {
    super(props);
    this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
    this.state = {
      sidebarExists: false
    };
  }
  mobileSidebarToggle(e) {
    if (this.state.sidebarExists === false) {
      this.setState({
        sidebarExists: true
      });
    }
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function() {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  }
  render() {
    return (
      <AdminNavbarLinks 
        keycloak={this.props.keycloak}
        history={this.props.history}
        environments={this.props.environments}
        selectedEnvironment={this.props.selectedEnvironment}
        handleEnvironmentChange={this.props.handleEnvironmentChange.bind(this)}
      />
    );
  }
}

export default Header;
