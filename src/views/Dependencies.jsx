import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Table
} from "react-bootstrap";
import { thDependenciesArray, tdDependenciesArray } from "variables/Variables.jsx";

import { Card } from "components/Card/Card.jsx";

class Dependencies extends Component {

  state = {
    item: {},
    showInsertUpdateForm: false,
    list: [],
    header: "",
    showConfirmDeleteModal: false,
    itemToDelete: {},
    inputFilter: "",
  }

  componentDidMount() {

  }

  render() {
    return (
      <div></div>
    )
  }

}

export default Dependencies;
