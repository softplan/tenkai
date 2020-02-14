import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Row,
  Col,
  FormControl,
  FormGroup,
  FormLabel
} from 'react-bootstrap';
import TenkaiTable from 'components/Table/TenkaiTable';
import * as col from 'components/Table/TenkaiColumn';

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

  onEdit = item => {
    this.setState({
      showInsertUpdateForm: true,
      editItem: item,
      editMode: true
    });
    window.scrollTo(0, 0);
  };

  onDelete = item => {
    this.setState({ itemToDelete: item }, () => {
      this.setState({ showConfirmDeleteModal: true });
    });
  };

  btnRules = (cell, row) => {
    return (
      <Button
        className="link-button"
        onClick={this.handleValueRule.bind(this, row)}
      >
        <i className="pe-7s-note2 cell-button-icon" />
      </Button>
    );
  };

  render() {
    let columns = [];
    columns.push(col.addId());
    columns.push(col.addCol('name', 'Name', '50%'));
    columns.push(col.addEdit(this.onEdit));
    columns.push(col.addDelete(this.onDelete));
    columns.push(
      col.addColBtn('btnRules', 'Associate Rules', this.btnRules, '20%')
    );

    const data = this.props.variableRules.filter(
      d =>
        this.state.inputFilter === '' || d.name.includes(this.state.inputFilter)
    );

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
  loading: valueRuleSelectors.getVariableLoading(state),
  variableRules: valueRuleSelectors.getVariableRules(state),
  error: valueRuleSelectors.getVariableError(state)
});

export default connect(mapStateToProps)(VariableRule);
