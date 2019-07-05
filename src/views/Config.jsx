import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Table
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import RepoForm from "components/Config/RepoForm.jsx";
import axios from 'axios';
import TENKAI_API_URL from 'env.js';

class Config extends Component {

  state = {
    showInsertUpdateForm: false,
    repoResult: { repositories: [] },
    editItem: {}
  }

  componentDidMount() {
    this.getRepositories()
  }

  getRepositories() {
    axios.get(TENKAI_API_URL + '/repositories')
      .then(response => this.setState({ repoResult: response.data }))
      .catch(error => {
        console.log(error.message);
        this.props.handleNotification("general_fail", "error");
      });

  }

  handleNewRepoClick(e) {
    this.setState(() => ({
      showInsertUpdateForm: true,
      editItem: {},
      editMode: false
    }));
  }

  handleCancelEnvironmentClick(e) {
    this.setState(() => ({
      showInsertUpdateForm: false,
      editItem: {},
      editMode: false
    }));
  }

  onDelete(item) {
    axios.delete(TENKAI_API_URL + "/repositories/" + item.name)
      .then(res => {
        this.getRepositories();
      }).catch(error => {
        console.log(error.message);
        this.props.handleNotification("general_fail", "error");
      });
  }

  onSaveClick(data) {
    console.log(data)

    if (this.state.editMode) {

      axios.put(TENKAI_API_URL + "/repositories", data)
        .then(res => {
          this.setState({ repoResult: { repositories: [...this.state.repoResult.repositories, data] } });
          this.getRepositories();
          this.setState(() => ({
            showInsertUpdateForm: false,
            editItem: {},
            editMode: false
          }));
        }).catch(error => {
          console.log(error.message);
          this.props.handleNotification("general_fail", "error");
      });


    } else {

      axios.post(TENKAI_API_URL + "/repositories", data)
        .then(res => {
          this.setState({ repoResult: { repositories: [...this.state.repoResult.repositories, data] } });
          this.getRepositories();
          this.setState(() => ({
            showInsertUpdateForm: false,
            editItem: {},
            editMode: false
          }));

        }).catch(error => {
          console.log(error.message);
          this.props.handleNotification("general_fail", "error");
        });
    }

  }


  render() {


    const items = this.state.repoResult.repositories.map((item, key) =>

      <tr key={key}>
        <td>{item.name}</td>
        <td>{item.url}</td>
        <td>{item.username}</td>
        <td><a href="#" onClick={this.onDelete.bind(this, item)}><i className="pe-7s-trash" /></a></td>
      </tr>

    );

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title=""
                content={
                  <form>
                    <Button className="pull-right" variant="primary" onClick={this.handleNewRepoClick.bind(this)} >New Repo</Button>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              {this.state.showInsertUpdateForm ?
                <RepoForm editMode={this.state.editMode} editItem={this.state.editItem} saveClick={this.onSaveClick.bind(this)} cancelClick={this.handleCancelEnvironmentClick.bind(this)} /> : null
              }
            </Col>
          </Row>


          <Row>
            <Col md={12}>
              <Card
                title="Repositories"
                content={
                  <form>
                    <div>
                      <Table bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>URL</th>
                            <th>username</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items}
                        </tbody>
                      </Table>
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

export default Config;
