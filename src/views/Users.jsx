import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  Row,
  Col,
  FormControl,
  Table,
  FormGroup,
  ControlLabel
} from 'react-bootstrap';

import Button from 'components/CustomButton/CustomButton.jsx';
import { Card } from 'components/Card/Card.jsx';
import CButton from 'components/CustomButton/CustomButton.jsx';
import UserForm from 'components/Users/UserForm.jsx';
import SimpleModal from 'components/Modal/SimpleModal.jsx';

import * as userActions from 'stores/user/actions';
import * as userSelectors from 'stores/user/reducer';

class Users extends Component {
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

  render() {
    const items = this.props.users
      .filter(
        d =>
          this.state.inputFilter === '' ||
          d.email.includes(this.state.inputFilter)
      )
      .map((item, key) => (
        <tr key={key}>
          <td>{item.ID}</td>
          <td>{item.email}</td>
          <td>
            <Button
              className="link-button"
              onClick={() =>
                this.setState({
                  showInsertUpdateForm: true,
                  editItem: item,
                  editMode: true
                })
              }
            >
              <i className="pe-7s-edit" />
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

        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title=""
                content={
                  <form>
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
                    <div className="clearfix" />
                  </form>
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
              <Card
                title="Users"
                content={
                  <form>
                    <div className="col-md-8">
                      <FormGroup>
                        <ControlLabel>User Search</ControlLabel>
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
                            <th>Edit</th>
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
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: userSelectors.getLoading(state),
  users: userSelectors.getUsers(state),
  error: userSelectors.getError(state)
});

export default connect(mapStateToProps)(Users);
