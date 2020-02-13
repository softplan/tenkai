import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Row,
  Col,
  FormControl,
  Table,
  FormGroup,
  FormLabel,
  ButtonToolbar
} from 'react-bootstrap';

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

  render() {
    const items = this.props.users
      .filter(
        d =>
          this.state.inputFilter === '' ||
          d.email.includes(this.state.inputFilter)
      )
      .sort((a, b) => utils.sort(a.email, b.email))
      .map((item, key) => (
        <tr key={key}>
          <td>{item.ID}</td>
          <td>{item.email}</td>
          <td>
            <Button
              className="link-button"
              onClick={this.onEdit.bind(this, item)}
            >
              <i className="pe-7s-home" />
            </Button>
          </td>
          <td>
            <Button
              className="link-button"
              onClick={this.onHandleRole.bind(this, item)}
            >
              <i className="pe-7s-ticket" />
            </Button>
          </td>
          <td>
            <Button
              className="link-button"
              onClick={e =>
                this.setState({ itemToDelete: item }, () => {
                  this.setState({ showConfirmDeleteModal: true });
                })
              }
            >
              <i className="pe-7s-trash" />
            </Button>
          </td>
        </tr>
      ));

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

                    <div>
                      <Table bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Email</th>
                            <th>Handle Environments</th>
                            <th>Handle Role</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>{items}</tbody>
                      </Table>
                    </div>
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
