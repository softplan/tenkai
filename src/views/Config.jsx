import React, { Component } from 'react';
import { Container, Row, Col, Table, ButtonToolbar } from 'react-bootstrap';

import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import Button from 'components/CustomButton/CustomButton.jsx';
import RepoForm from 'components/Config/RepoForm.jsx';
import SimpleModal from 'components/Modal/SimpleModal.jsx';
import { getDefaultRepo } from 'client-api/apicall.jsx';

import axios from 'axios';
import TENKAI_API_URL from 'env.js';

import TenkaiTable from 'components/Table/TenkaiTable';
import * as col from 'components/Table/TenkaiColumn';

class Config extends Component {
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
      .get(TENKAI_API_URL + '/repositories')
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
    axios
      .delete(TENKAI_API_URL + '/repositories/' + item.name)
      .then(res => {
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
  }

  setDefault(item) {
    this.props.handleLoading(true);
    let payload = { reponame: item.name };
    axios
      .post(TENKAI_API_URL + '/repo/default', payload)
      .then(res => {
        this.getRepositories();
        this.props.handleLoading(false);
      })
      .catch(error => {
        this.props.handleLoading(false);
        this.props.handleNotification('general_fail', 'error');
      });
  }

  onRepoUpdateClick() {
    this.props.handleLoading(true);

    axios
      .get(TENKAI_API_URL + '/repoUpdate')
      .then(res => {
        this.props.handleLoading(false);
      })
      .catch(error => {
        this.props.handleLoading(false);
        this.props.handleNotification('general_fail', 'error');
      });
  }

  handleConfirmDelete() {
    if (this.state.itemToDelete !== undefined) {
      axios
        .delete(
          TENKAI_API_URL + '/repositories/' + this.state.itemToDelete.name
        )
        .then(res => {
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
    if (this.state.editMode) {
      axios
        .put(TENKAI_API_URL + '/repositories', data)
        .then(res => {
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
    } else {
      axios
        .post(TENKAI_API_URL + '/repositories', data)
        .then(res => {
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
  }

  getHighLight = (row, rowIndex) => {
    let result = '';
    if (row.name === this.state.defaultRepo) {
      result = 'bg-info';
    }
    return result;
  };

  btnSetDefault = (cell, row) => {
    return (
      <Button className="link-button" onClick={this.setDefault.bind(this, row)}>
        <i className="pe-7s-arc cell-button-icon" />
      </Button>
    );
  };

  render() {
    let columns = [];
    columns.push(col.addCol('name', 'Name'));
    columns.push(col.addCol('url', 'Url'));
    columns.push(col.addCol('username', 'Username'));

    let hasDeletePermission = !this.props.keycloak.hasRealmRole('tenkai-admin');
    columns.push(col.addDelete(this.onDelete, '10%', hasDeletePermission));

    columns.push(
      col.addColBtn('setDefault', 'Set Default', this.btnSetDefault)
    );

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
                        variant="info"
                        onClick={this.onRepoUpdateClick.bind(this)}
                        disabled={
                          !this.props.keycloak.hasRealmRole('tenkai-admin')
                        }
                      >
                        Repo Update
                      </Button>

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
                <RepoForm
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
                title="Repositories"
                content={
                  <form>
                    <TenkaiTable
                      columns={columns}
                      data={data}
                      rowClasses={this.getHighLight}
                    />
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

export default Config;
