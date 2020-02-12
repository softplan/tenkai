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

import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import CButton from 'components/CustomButton/CustomButton.jsx';
import UserForm from 'views/user/components/EditUser.js';
import SimpleModal from 'components/Modal/SimpleModal.jsx';

import * as userActions from 'stores/user/actions';
import * as userSelectors from 'stores/user/reducer';

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

  onSaveClick(data) {
    this.props.dispatch(userActions.saveUser(data));

    this.setState({
      showInsertUpdateForm: false,
      editItem: {},
      editMode: false
    });
  }

  handleConfirmDelete() {
    this.props.dispatch(userActions.deleteUser(this.state.itemToDelete.ID));

    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  onEdit = item => {
    window.scrollTo(0, 0);
    this.setState({
      showInsertUpdateForm: true,
      editItem: item,
      editMode: true
    });
  };

  onDelete = item => {
    this.setState({ itemToDelete: item }, () => {
      this.setState({ showConfirmDeleteModal: true });
    });
  };

  render() {
    let columns = [];
    columns.push(col.addCol('email', 'Email'));
    columns.push(col.addEdit(this.onEdit));
    columns.push(col.addDelete(this.onDelete));

    let data = this.props.users.filter(
      d =>
        this.state.inputFilter === '' ||
        d.email.includes(this.state.inputFilter)
    );

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
