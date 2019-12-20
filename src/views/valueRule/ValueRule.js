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
import queryString from 'query-string';

import Button from 'components/CustomButton/CustomButton.jsx';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import EditRule from 'views/valueRule/components/EditValueRule';
import SimpleModal from 'components/Modal/SimpleModal.jsx';

import * as valueRuleActions from 'stores/valueRule/actions';
import * as valueRuleSelectors from 'stores/valueRule/reducer';
import CardButton from 'components/CardButton/CardButton';

class Rule extends Component {
  constructor(props) {
    super(props);

    const values = queryString.parse(props.location.search);
    this.state = {
      variableRuleId: values.variableRuleId,
      showInsertUpdateForm: false,
      inputFilter: '',
      showConfirmDeleteModal: false,
      itemToDelete: {}
    };
  }

  componentDidMount() {
    this.props.dispatch(
      valueRuleActions.allValueRules(this.state.variableRuleId)
    );
    this.props.dispatch(valueRuleActions.allRuleTypes());
  }

  onSaveClick(data) {
    data.variableRuleId = parseInt(this.state.variableRuleId);

    if (this.state.editMode) {
      this.props.dispatch(valueRuleActions.editValueRule(data));
    } else {
      this.props.dispatch(valueRuleActions.createValueRule(data));
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
      valueRuleActions.deleteValueRule(
        this.state.itemToDelete.ID,
        parseInt(this.state.variableRuleId)
      )
    );

    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  onEdit = item => {
    this.setState({
      showInsertUpdateForm: true,
      editItem: item,
      editMode: true
    });
    window.scrollTo(0, 0);
  };

  getHeader() {
    const parent = this.props.variableRules.find(
      e => e.ID === parseInt(this.state.variableRuleId)
    );
    return parent != null ? `Variable rule name: "${parent.name}"` : '';
  }

  render() {
    const items = this.props.rules
      .filter(
        d =>
          this.state.inputFilter === '' ||
          d.type.includes(this.state.inputFilter)
      )
      .map((item, key) => (
        <tr key={key}>
          <td>{item.ID}</td>
          <td>{item.type}</td>
          <td>{item.value}</td>
          <td>
            <Button
              className="link-button"
              onClick={this.onEdit.bind(this, item)}
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
                header={this.getHeader()}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              {this.state.showInsertUpdateForm ? (
                <EditRule
                  editMode={this.state.editMode}
                  editItem={this.state.editItem}
                  saveClick={this.onSaveClick.bind(this)}
                  ruleTypes={this.props.ruleTypes}
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
                title="Rules"
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
                            <th>Type</th>
                            <th>Value</th>
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
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: valueRuleSelectors.getLoading(state),
  rules: valueRuleSelectors.getRules(state),
  ruleTypes: valueRuleSelectors.getRuleTypes(state),
  variableRules: valueRuleSelectors.getVariableRules(state),
  error: valueRuleSelectors.getError(state)
});

export default connect(mapStateToProps)(Rule);
