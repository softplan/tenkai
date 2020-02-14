import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormControl,
  ButtonToolbar
} from 'react-bootstrap';
import SimpleModal from 'components/Modal/SimpleModal.jsx';

import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import Button from 'components/CustomButton/CustomButton.jsx';
import SolutionChartForm from 'components/Solution/SolutionChartForm.jsx';
import queryString from 'query-string';

import * as solutionChartActions from 'stores/solutionChart/actions';
import * as solutionChartSelectors from 'stores/solutionChart/reducer';

import TenkaiTable from 'components/Table/TenkaiTable';
import * as col from 'components/Table/TenkaiColumn';

class SolutionChart extends Component {
  constructor(props) {
    super(props);
    const values = queryString.parse(props.location.search);
    this.state = {
      solutionId: values.solutionId,
      item: {},
      showInsertUpdateForm: false,
      header: '',
      showConfirmDeleteModal: false,
      itemToDelete: {},
      inputFilter: '',
      editMode: false,
      editItem: {},
      solutionName: ''
    };
  }

  componentDidMount() {
    this.props.dispatch(
      solutionChartActions.allSolutionCharts(this.state.solutionId)
    );
  }

  handleConfirmDelete() {
    this.props.dispatch(
      solutionChartActions.deleteSolutionChart(
        this.state.itemToDelete.ID,
        this.state.solutionId
      )
    );

    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  onSaveClick(data) {
    data.solution_id = parseInt(this.state.solutionId);

    if (this.state.editMode) {
      this.props.dispatch(
        solutionChartActions.editSolutionChart(data, this.state.solutionId)
      );
    } else {
      this.props.dispatch(
        solutionChartActions.createSolutionChart(data, this.state.solutionId)
      );
    }

    this.setState({
      showInsertUpdateForm: false,
      editItem: {},
      editMode: false
    });
  }

  onDelete = item => {
    this.setState({ itemToDelete: item }, () => {
      this.setState({ showConfirmDeleteModal: true });
    });
  };

  render() {
    let columns = [];
    columns.push(col.addCol('chartName', 'Chart Name', '90%'));
    columns.push(col.addDelete(this.onDelete));

    const data = this.props.solutionCharts.filter(
      d =>
        this.state.inputFilter === '' ||
        d.chartName.includes(this.state.inputFilter)
    );

    return (
      <div className="content">
        <SimpleModal
          showConfirmDeleteModal={this.state.showConfirmDeleteModal}
          handleConfirmDeleteModalClose={() =>
            this.setState({ showConfirmDeleteModal: false, itemToDelete: {} })
          }
          title="Confirm"
          subTitle="Delete chart association"
          message="Are you sure you want to delete this chart association?"
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}
        ></SimpleModal>

        <Container fluid>
          <Row>
            <Col md={12}>
              <CardTenkai
                title=""
                content={
                  <Container fluid>
                    <h2>{this.state.solutionName}</h2>
                    <div align="right">
                      <ButtonToolbar style={{ display: 'block' }}>
                        <Button
                          className="pull-right"
                          variant="primary"
                          onClick={() =>
                            this.setState({ showInsertUpdateForm: true })
                          }
                        >
                          Associate Chart
                        </Button>
                      </ButtonToolbar>
                    </div>
                  </Container>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              {this.state.showInsertUpdateForm ? (
                <SolutionChartForm
                  editMode={this.state.editMode}
                  handleLoading={this.props.handleLoading}
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
                title="Charts"
                content={
                  <form>
                    <div>
                      <div className="col-md-8">
                        <FormGroup>
                          <FormLabel>Charts Search</FormLabel>
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
  loading: solutionChartSelectors.getLoading(state),
  solutionCharts: solutionChartSelectors.getSolutionCharts(state),
  error: solutionChartSelectors.getError(state)
});

export default connect(mapStateToProps)(SolutionChart);
