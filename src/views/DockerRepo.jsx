import React, { Component } from 'react';
import { Container, Row, Col, ButtonToolbar } from 'react-bootstrap';

import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import Button from 'components/CustomButton/CustomButton.jsx';
import DockerRepoForm from 'components/Forms/DockerRepoForm.jsx';
import SimpleModal from 'components/Modal/SimpleModal.jsx';
import { getDefaultRepo } from 'client-api/apicall.jsx';

import axios from 'axios';
import TENKAI_API_URL from 'env.js';

import TenkaiTable from 'components/Table/TenkaiTable';
import * as col from 'components/Table/TenkaiColumn';

class DockerRepo extends Component {
  state = {
    showInsertUpdateForm: false,
    repoResult: { repositories: [] },
    editItem: {},
    showConfirmDeleteModal: false,
    itemToDelete: {},
    defaultRepo: ''
  };

  componentDidMount() {
    this.getRepositories();
  }

  handleConfirmDeleteModalClose() {
    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  handleConfirmDeleteModalShow() {
    this.setState({ showConfirmDeleteModal: true });
  }

  getRepositories() {
    axios
      .get(TENKAI_API_URL + '/dockerRepo')
      .then(response =>
        this.setState({ repoResult: response.data }, () => {
          getDefaultRepo(this);
        })
      )
      .catch(error => {
        console.log(error.message);
        this.props.handleNotification('general_fail', 'error');
      });
  }

  handleNewRepoClick() {
    this.setState(() => ({
      showInsertUpdateForm: true,
      editItem: {},
      editMode: false
    }));
  }

  handleCancelEnvironmentClick() {
    this.setState(() => ({
      showInsertUpdateForm: false,
      editItem: {},
      editMode: false
    }));
  }

  onConfirmDelete(item) {
    axios
      .delete(TENKAI_API_URL + '/dockerRepo/' + item.name)
      .then(() => {
        this.getRepositories();
      })
      .catch(error => {
        console.log(error.message);
        this.props.handleNotification('general_fail', 'error');
      });
  }

  onDelete = item => {
    this.setState({ itemToDelete: item }, () => {
      this.handleConfirmDeleteModalShow();
    });
  };

  handleConfirmDelete() {
    if (this.state.itemToDelete !== undefined) {
      axios
        .delete(TENKAI_API_URL + '/dockerRepo/' + this.state.itemToDelete.name)
        .then(() => {
          this.getRepositories();
        })
        .catch(error => {
          console.log(error.message);
          this.props.handleNotification('general_fail', 'error');
        });
    }
    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  onSaveClick(data) {
    axios
      .post(TENKAI_API_URL + '/dockerRepo', data)
      .then(() => {
        this.setState({
          repoResult: {
            repositories: [...this.state.repoResult.repositories, data]
          }
        });
        this.getRepositories();
        this.setState(() => ({
          showInsertUpdateForm: false,
          editItem: {},
          editMode: false
        }));
      })
      .catch(error => {
        console.log(error.message);
        this.props.handleNotification('general_fail', 'error');
      });
  }

  render() {
    let columns = [];
    columns.push(col.addCol('host', 'Host'));
    columns.push(col.addCol('username', 'Username'));
    let hasDeletePermission = !this.props.keycloak.hasRealmRole('tenkai-admin');
    columns.push(col.addDelete(this.onDelete, '10%', hasDeletePermission));

    const data = this.state.repoResult.repositories;

    return (
      <div className="content">
        <SimpleModal
          showConfirmDeleteModal={this.state.showConfirmDeleteModal}
          handleConfirmDeleteModalClose={this.handleConfirmDeleteModalClose.bind(
            this
          )}
          title="Confirm"
          subTitle="Delete repository"
          message="Are you sure you want to delete this repository?"
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}
        ></SimpleModal>

        <Container fluid>
          <Row>
            <Col md={12}>
              <CardTenkai
                title=""
                content={
                  <div align="right">
                    <ButtonToolbar style={{ display: 'block' }}>
                      <Button
                        className="pull-right"
                        variant="primary"
                        onClick={this.handleNewRepoClick.bind(this)}
                        disabled={
                          !this.props.keycloak.hasRealmRole('tenkai-admin')
                        }
                      >
                        New Repo
                      </Button>
                    </ButtonToolbar>
                  </div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              {this.state.showInsertUpdateForm ? (
                <DockerRepoForm
                  editMode={this.state.editMode}
                  editItem={this.state.editItem}
                  saveClick={this.onSaveClick.bind(this)}
                  cancelClick={this.handleCancelEnvironmentClick.bind(this)}
                />
              ) : null}
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <CardTenkai
                title="Docker Repositories"
                content={
                  <form>
                    <TenkaiTable columns={columns} data={data} />
                  </form>
                }
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default DockerRepo;
