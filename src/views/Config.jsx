import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Table, ButtonToolbar
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import RepoForm from "components/Config/RepoForm.jsx";
import SimpleModal from 'components/Modal/SimpleModal.jsx'
import { getDefaultRepo } from 'client-api/apicall.jsx';

import axios from 'axios';
import TENKAI_API_URL from 'env.js';

class Config extends Component {

  state = {
    showInsertUpdateForm: false,
    repoResult: { repositories: [] },
    editItem: {},
    showConfirmDeleteModal: false,
    itemToDelete: {},
    defaultRepo: "",

  }

  componentDidMount() {
    this.getRepositories()
  }

  handleConfirmDeleteModalClose() {
    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  handleConfirmDeleteModalShow() {
    this.setState({ showConfirmDeleteModal: true });
  }

  getRepositories() {
    axios.get(TENKAI_API_URL + '/repositories')
      .then(response => this.setState({ repoResult: response.data }, () => {
        getDefaultRepo(this);
      }))
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

  onConfirmDelete(item) {
    axios.delete(TENKAI_API_URL + "/repositories/" + item.name)
      .then(res => {
        this.getRepositories();
      }).catch(error => {
        console.log(error.message);
        this.props.handleNotification("general_fail", "error");
      });
  }

  onDelete(item) {
    this.setState({ itemToDelete: item }, () => { this.handleConfirmDeleteModalShow() });
  }

   setDefault(item) {
    this.props.handleLoading(true);
    let payload = {reponame: item.name}
    axios.post(TENKAI_API_URL + "/repo/default", payload)
    .then(res => {
      this.getRepositories()
      this.props.handleLoading(false);
    }).catch(error => {
      this.props.handleLoading(false);
      this.props.handleNotification("general_fail", "error");
    });

  }

  onRepoUpdateClick() {

    this.props.handleLoading(true);

    axios.get(TENKAI_API_URL + "/repoUpdate")
      .then(res => {
        this.props.handleLoading(false);
      }).catch(error => {
        this.props.handleLoading(false);
        this.props.handleNotification("general_fail", "error");
      });

  }

  handleConfirmDelete() {
    if (this.state.itemToDelete !== undefined) {
      axios.delete(TENKAI_API_URL + "/repositories/" + this.state.itemToDelete.name)
        .then(res => {
          this.getRepositories();
        }).catch(error => {
          console.log(error.message);
          this.props.handleNotification("general_fail", "error");
        });
    }
    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
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

  getHighLight(item) {
    let result = "";
    console.log(this.state.defaultRepo);
    if (item.name === this.state.defaultRepo) {
      result = "bg-info";
    } 
    return result;
  }


  render() {



    const items = this.state.repoResult.repositories.map((item, key) =>

    
      <tr key={key} className={this.getHighLight(item)}>
        <td>{item.name}</td>
        <td>{item.url}</td>
        <td>{item.username}</td>
        <td><Button className="link-button" disabled={!this.props.keycloak.hasRealmRole("tenkai-admin")}
                        
          onClick={this.onDelete.bind(this, item)}><i className="pe-7s-trash" /></Button></td>
        <td><Button className="link-button"
          onClick={this.setDefault.bind(this, item)}><i className="pe-7s-arc" /></Button></td>


      </tr>

    );

    return (
      <div className="content">


        <SimpleModal
          showConfirmDeleteModal={this.state.showConfirmDeleteModal}
          handleConfirmDeleteModalClose={this.handleConfirmDeleteModalClose.bind(this)}
          title="Confirm" subTitle="Delete repository" message="Are you sure you want to delete this repository?"
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}>
        </SimpleModal>


        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title=""
                content={
                  <form>
                    <ButtonToolbar>

                      <Button className="pull-right" 
                        variant="info" 
                        onClick={this.onRepoUpdateClick.bind(this)} 
                        disabled={!this.props.keycloak.hasRealmRole("tenkai-admin")}
                        >Repo Update</Button>

                      <Button className="pull-right" variant="primary" 
                        onClick={this.handleNewRepoClick.bind(this)} 
                        disabled={!this.props.keycloak.hasRealmRole("tenkai-admin")}
                        >New Repo</Button>

                    </ButtonToolbar>
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
                      <Table bordered size="sm">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>URL</th>
                            <th>username</th>
                            <th>Delete</th>
                            <th>Set Default</th>
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
