import React, { Component } from "react";
import {
  Grid,
  Row,
  Col, FormGroup, ControlLabel,
  FormControl, Table
} from "react-bootstrap";
import SimpleModal from 'components/Modal/SimpleModal.jsx'
import queryString from 'query-string';
import axios from 'axios';
import TENKAI_API_URL from 'env.js';

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import DepForm from "components/Dependencies/DepForm.jsx";

class Dependencies extends Component {

  state = {
    item: {},
    showInsertUpdateForm: false,
    list: [],
    header: "",
    showConfirmDeleteModal: false,
    itemToDelete: {},
    inputFilter: "",
    editMode: false,
    editItem: {},
  }

  componentDidMount() {

  }

  handleConfirmDeleteModalClose() {
    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  handleConfirmDeleteModalShow() {
    this.setState({ showConfirmDeleteModal: true });
  }

  handleNewClick(e) {
    this.setState({ showInsertUpdateForm: true });
  }

  handleCancelClick(e) {
    this.setState(() => ({
      showInsertUpdateForm: true,
      editItem: {},
      editMode: false
    }));
  }

  onChangeFilterHandler(e) {
    this.setState({
      inputFilter: e.target.value,
    })
  }

  onDelete(item) {
    this.setState({ itemToDelete: item }, () => { this.handleConfirmDeleteModalShow() });
  }

  handleConfirmDelete() {
    if (this.state.itemToDelete != undefined) {
      axios.delete(TENKAI_API_URL + "/dependencies/delete/" + this.state.itemToDelete.ID).then(this.getScopedVariables()).catch(error => {
        console.log(error.message);
        this.props.handleNotification("general_fail", "error");
      });
    }
    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  onSaveClick(data) {
    if (this.state.editMode) {
      console.log("edit")

    } else {
      console.log("new")

    }
  }

  handleCancelClick(e) {
    this.setState(() => ({
      showInsertUpdateForm: false,
      editItem: {},
      editMode: false
    }));
  }







  render() {

    const items = this.state.list
      .filter(d => this.state.inputFilter === '' || d.name.includes(this.state.inputFilter)).map((item, key) =>
        <tr key={key}>
          <td>{item.release}</td>
          <td>{item.version}</td>
          <td><a href="#" onClick={this.navigateToEditEnvironment.bind(this, item)}><i className="pe-7s-edit" /></a></td>
          <td><a href="#" onClick={this.onDelete.bind(this, item)}><i className="pe-7s-trash" /></a></td>
        </tr>

      );



    return (
      <div className="content">

        <SimpleModal
          showConfirmDeleteModal={this.state.showConfirmDeleteModal}
          handleConfirmDeleteModalClose={this.handleConfirmDeleteModalClose.bind(this)}
          title="Confirm" subTitle="Delete variable" message="Are you sure you want to delete this variable?"
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}
          handleConfirmDeleteModalClose={this.handleConfirmDeleteModalClose.bind(this)}>
        </SimpleModal>

        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title=""
                content={
                  <form>

                    <h2>{this.state.environmentName}</h2>
                    <Button className="pull-right" variant="primary" onClick={this.handleNewClick.bind(this)}>New Release</Button>
                    <div className="clearfix" />

                  </form>

                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              {this.state.showInsertUpdateForm ?
                <DepForm editMode={this.state.editMode}
                  editItem={this.state.editItem}
                  saveClick={this.onSaveClick.bind(this)}
                  cancelClick={this.handleCancelClick.bind(this)} /> : null
              }
            </Col>
          </Row>


          <Row>
            <Col md={12}>
              <Card
                title="Dependencies"
                content={
                  <form>
                    <div>

                      <div className="col-md-8">
                        <FormGroup>
                          <ControlLabel>Dependency Search</ControlLabel>
                          <FormControl
                            value={this.state.inputFilter}
                            onChange={this.onChangeFilterHandler.bind(this)}
                            style={{ width: '100%' }} type="text"
                            placeholder="Search using any field"
                            aria-label="Search using any field"></FormControl>

                        </FormGroup>
                      </div>







                      <div>
                        <Table bordered hover size="sm">
                          <thead>
                            <tr>
                              <th>Release</th>
                              <th>Version</th>
                              <th>Edit</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items}
                          </tbody>
                        </Table>
                      </div>


                    </div>
                  </form>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );


  }

}

export default Dependencies;
