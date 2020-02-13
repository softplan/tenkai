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

import Button from 'components/CustomButton/CustomButton.jsx';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import CButton from 'components/CustomButton/CustomButton.jsx';
import SolutionForm from 'components/Solution/SolutionForm.jsx';
import SimpleModal from 'components/Modal/SimpleModal.jsx';

import * as solutionActions from 'stores/solution/actions';
import * as solutionSelectors from 'stores/solution/reducer';

import TenkaiTable from 'components/Table/TenkaiTable';
import * as col from 'components/Table/TenkaiColumn';

class Solution extends Component {
  state = {
    showInsertUpdateForm: false,
    inputFilter: '',
    showConfirmDeleteModal: false,
    itemToDelete: {}
  };

  componentDidMount() {
    this.props.dispatch(solutionActions.allSolutions());
  }

  onSaveClick(data) {
    if (this.state.editMode) {
      this.props.dispatch(solutionActions.editSolution(data));
    } else {
      this.props.dispatch(solutionActions.createSolution(data));
    }

    this.setState({
      showInsertUpdateForm: false,
      editItem: {},
      editMode: false
    });
  }

  handleConfirmDelete() {
    this.props.dispatch(
      solutionActions.deleteSolution(this.state.itemToDelete.ID)
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

  onDelete = item => {
    this.setState({ itemToDelete: item }, () => {
      this.setState({ showConfirmDeleteModal: true });
    });
  };

  btnCharts = (cell, row) => {
    return (
      <Button
        className="link-button"
        onClick={() =>
          this.props.history.push({
            pathname: '/admin/solution-deps',
            search: '?solutionId=' + row.ID
          })
        }
      >
        <i className="pe-7s-album cell-button-icon" />
      </Button>
    );
  };

  btnDeploy = (cell, row) => {
    return (
      <Button
        className="link-button"
        onClick={() =>
          this.props.history.push({
            pathname: '/admin/solution-deploy',
            search: '?solutionId=' + row.ID
          })
        }
      >
        <i className="pe-7s-helm" />
      </Button>
    );
  };

  render() {
    let columns = [];
    columns.push(col.addId());
    columns.push(col.addCol('name', 'Solution Name', '25%'));
    columns.push(col.addCol('team', 'Team', '25%'));
    columns.push(col.addEdit(this.onEdit));
    columns.push(col.addDelete(this.onDelete));
    columns.push(col.addColBtn('charts', 'Charts', this.btnCharts));
    columns.push(col.addColBtn('deploy', 'Deploy', this.btnDeploy));

    let data = this.props.solutions.filter(
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
          subTitle="Delete solution"
          message="Are you sure you want to delete this solution?"
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
                        New Solution
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
                <SolutionForm
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
                title="Solutions"
                content={
                  <form>
                    <div className="col-md-8">
                      <FormGroup>
                        <FormLabel>Solution Search</FormLabel>
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
  loading: solutionSelectors.getLoading(state),
  solutions: solutionSelectors.getSolutions(state),
  error: solutionSelectors.getError(state)
});

export default connect(mapStateToProps)(Solution);
