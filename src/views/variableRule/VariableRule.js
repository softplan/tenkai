import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Row,
  Col,
  FormControl,
  Table,
  FormGroup,
  FormLabel
} from 'react-bootstrap';

import Button from 'components/CustomButton/CustomButton.jsx';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import EditVariableRule from 'views/variableRule/components/EditVariableRule';
import SimpleModal from 'components/Modal/SimpleModal.jsx';

import * as variableRuleActions from 'stores/variableRule/actions';
import * as valueRuleSelectors from 'stores/variableRule/reducer';
import CardButton from 'components/CardButton/CardButton';

class VariableRule extends Component {
  state = {
    showInsertUpdateForm: false,
    inputFilter: '',
    showConfirmDeleteModal: false,
    itemToDelete: {}
  };

  componentDidMount() {
    this.props.dispatch(variableRuleActions.allVariableRules());
  }

  onSaveClick(data) {
    if (this.state.editMode) {
      this.props.dispatch(variableRuleActions.editVariableRule(data));
    } else {
      this.props.dispatch(variableRuleActions.createVariableRule(data));
    }

    this.setState({
      showInsertUpdateForm: false,
      editItem: {},
      editMode: false
    });
  }

  onClickNew() {
    this.setState({
      showInsertUpdateForm: true,
      editItem: {},
      editMode: false
    });
  }

  handleConfirmDelete() {
    this.props.dispatch(
      variableRuleActions.deleteVariableRule(this.state.itemToDelete.ID)
    );

    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  handleValueRule(item) {
    this.setState({ selectedRule: item.ID });
    this.props.history.push({
      pathname: '/admin/value-rule',
      search: '?variableRuleId=' + item.ID
    });
  }

  render() {
    const items = this.props.variableRules
      .filter(
        d =>
          this.state.inputFilter === '' ||
          d.name.includes(this.state.inputFilter)
      )
      .map((item, key) => (
        <tr key={key}>
          <td>{item.ID}</td>
          <td>{item.name}</td>
          <td>
            <Button
              className="link-button"
              onClick={() => {
                this.setState({
                  showInsertUpdateForm: true,
                  editItem: item,
                  editMode: true
                });
                window.scrollTo(0, 0);
              }}
            >
              <i className="pe-7s-edit" />
            </Button>
          </td>
          <td>
            <Button
              className="link-button"
              onClick={() =>
                this.setState({ itemToDelete: item }, () => {
                  this.setState({ showConfirmDeleteModal: true });
                })
              }
            >
              <i className="pe-7s-trash" />
            </Button>
          </td>
          <td>
            <Button
              className="link-button"
              onClick={this.handleValueRule.bind(this, item)}
            >
              <i className="pe-7s-note2" />
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
          subTitle="Delete rule"
          message="Are you sure you want to delete this rule?"
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}
        ></SimpleModal>

        <Container fluid>
          <Row>
            <Col md={12}>
              <CardButton
                buttonName="New Rule"
                handleClick={this.onClickNew.bind(this)}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              {this.state.showInsertUpdateForm ? (
                <EditVariableRule
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
                title="Variable Rules"
                content={
                  <form>
                    <div className="col-md-8">
                      <FormGroup>
                        <FormLabel>Rule Search</FormLabel>
                        <FormControl
                          value={this.state.inputFilter}
                          onChange={e =>
                            this.setState({
                              inputFilter: e.target.value
                            })
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
                            <th>Name</th>
                            <th>Edit</th>
                            <th>Delete</th>
                            <th>Associate Rules</th>
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
  loading: valueRuleSelectors.getVariableLoading(state),
  variableRules: valueRuleSelectors.getVariableRules(state),
  error: valueRuleSelectors.getVariableError(state)
});

export default connect(mapStateToProps)(VariableRule);
