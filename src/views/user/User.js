import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Row,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  ButtonToolbar
} from 'react-bootstrap';
import TenkaiTable from 'components/Table/TenkaiTable';
import * as col from 'components/Table/TenkaiColumn';

import Button from 'components/CustomButton/CustomButton.jsx';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import CButton from 'components/CustomButton/CustomButton.jsx';
import UserForm from 'views/user/components/EditUser.js';
import EditRole from 'views/user/EditRole.js';
import SimpleModal from 'components/Modal/SimpleModal.jsx';

import * as userActions from 'stores/user/actions';
import * as userSelectors from 'stores/user/reducer';
import * as utils from 'utils/sort';

class User extends Component {
  state = {
    showInsertUpdateForm: false,
    inputFilter: '',
    showConfirmDeleteModal: false,
    itemToDelete: {}
  };

  componentDidMount() {
    this.props.dispatch(userActions.allUsers());
  }

  onSaveRoleClick(data) {
    console.log(data);
    this.props.dispatch(userActions.saveRoles(data));
    this.setState({
      showInsertUpdateForm: false,
      showEditRoleForm: false,
      editItem: {},
      editMode: false
    });
  }

  onSaveClick(data) {
    this.props.dispatch(userActions.saveUser(data));

    this.setState({
      showInsertUpdateForm: false,
      showEditRoleForm: false,
      editItem: {},
      editMode: false
    });
  }

  handleConfirmDelete() {
    this.props.dispatch(userActions.deleteUser(this.state.itemToDelete.ID));

    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  onHandleRole(item) {
    window.scrollTo(0, 0);
    this.setState({
      showEditRoleForm: true,
      editItem: item,
      editMode: true
    });
  }

  onEdit(item) {
    window.scrollTo(0, 0);
    this.setState({
      showInsertUpdateForm: true,
      editItem: item,
      editMode: true
    });
  }

  btnHandleEnv = (cell, row) => {
    return (
      <Button className="link-button" onClick={this.onEdit.bind(this, row)}>
        <i className="pe-7s-home" />
      </Button>
    );
  };

  btnHandleRole = (cell, row) => {
    return (
      <Button
        className="link-button"
        onClick={this.onHandleRole.bind(this, row)}
      >
        <i className="pe-7s-ticket" />
      </Button>
    );
  };

  onDelete = item => {
    this.setState({ itemToDelete: item }, () => {
      this.setState({ showConfirmDeleteModal: true });
    });
  };

  render() {
    let columns = [];
    columns.push(col.addId());
    columns.push(col.addCol('email', 'Email', '60%'));
    columns.push(
      col.addColBtn('handleEnv', 'Handle Environments', this.btnHandleEnv)
    );
    columns.push(
      col.addColBtn('handleRole', 'Handle Role', this.btnHandleRole)
    );
    columns.push(col.addDelete(this.onDelete));

    const data = this.props.users
      .filter(
        d =>
          this.state.inputFilter === '' ||
          d.email.includes(this.state.inputFilter)
      )
      .sort((a, b) => utils.sort(a.email, b.email));

    return (
      <div className="content">
        <SimpleModal
          showConfirmDeleteModal={this.state.showConfirmDeleteModal}
          handleConfirmDeleteModalClose={() =>
            this.setState({ showConfirmDeleteModal: false, itemToDelete: {} })
          }
          title="Confirm"
          subTitle="Delete user"
          message="Are you sure you want to delete this user?"
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
                      <CButton
                        className="pull-right"
                        variant="primary"
                        onClick={() =>
                          this.setState({
                            showInsertUpdateForm: true,
                            editItem: {},
                            editMode: false
                          })
                        }
                      >
                        New User
                      </CButton>
                    </ButtonToolbar>
                  </div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              {this.state.showEditRoleForm ? (
                <EditRole
                  editMode={this.state.editMode}
                  editItem={this.state.editItem}
                  saveClick={this.onSaveRoleClick.bind(this)}
                  cancelClick={() =>
                    this.setState({
                      showEditRoleForm: false,
                      editItem: {},
                      editMode: false
                    })
                  }
                />
              ) : null}
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              {this.state.showInsertUpdateForm ? (
                <UserForm
                  editMode={this.state.editMode}
                  editItem={this.state.editItem}
                  saveClick={this.onSaveClick.bind(this)}
                  cancelClick={() =>
                    this.setState({
                      showInsertUpdateForm: false,
                      editItem: {},
                      editMode: false
                    })
                  }
                />
              ) : null}
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <CardTenkai
                title="Users"
                content={
                  <form>
                    <div className="col-md-8">
                      <FormGroup>
                        <FormLabel>User Search</FormLabel>
                        <FormControl
                          value={this.state.inputFilter}
                          onChange={e =>
                            this.setState({ inputFilter: e.target.value })
                          }
                          style={{ width: '100%' }}
                          type="text"
                          placeholder="Search using any field"
                          aria-label="Search using any field"
                        ></FormControl>
                      </FormGroup>
                    </div>
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

const mapStateToProps = state => ({
  loading: userSelectors.getLoading(state),
  users: userSelectors.getUsers(state),
  error: userSelectors.getError(state)
});

export default connect(mapStateToProps)(User);
