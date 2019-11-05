import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  Table
} from "react-bootstrap";
import SimpleModal from "components/Modal/SimpleModal.jsx";

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import SolutionChartForm from "components/Solution/SolutionChartForm.jsx";
import queryString from "query-string";

import * as solutionChartActions from "stores/solutionChart/actions";
import * as solutionChartSelectors from "stores/solutionChart/reducer";

class SolutionChart extends Component {
  constructor(props) {
    super(props);
    const values = queryString.parse(props.location.search);
    this.state = {
      solutionId: values.solutionId,
      item: {},
      showInsertUpdateForm: false,
      header: "",
      showConfirmDeleteModal: false,
      itemToDelete: {},
      inputFilter: "",
      editMode: false,
      editItem: {},
      solutionName: ""
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

  render() {
    const items = this.props.solutionCharts
      .filter(
        d =>
          this.state.inputFilter === "" ||
          d.chartName.includes(this.state.inputFilter)
      )
      .map((item, key) => (
        <tr key={key}>
          <td>{item.chartName}</td>
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
          subTitle="Delete chart association"
          message="Are you sure you want to delete this chart association?"
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}
        ></SimpleModal>

        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title=""
                content={
                  <form>
                    <h2>{this.state.solutionName}</h2>
                    <Button
                      className="pull-right"
                      variant="primary"
                      onClick={() =>
                        this.setState({ showInsertUpdateForm: true })
                      }
                    >
                      Associate Chart
                    </Button>
                    <div className="clearfix" />
                  </form>
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
              <Card
                title="Charts"
                content={
                  <form>
                    <div>
                      <div className="col-md-8">
                        <FormGroup>
                          <ControlLabel>Charts Search</ControlLabel>
                          <FormControl
                            value={this.state.inputFilter}
                            onChange={e =>
                              this.setState({ inputFilter: e.target.value })
                            }
                            style={{ width: "100%" }}
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
                              <th>Helm Chart</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>{items}</tbody>
                        </Table>
                      </div>
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
  loading: solutionChartSelectors.getLoading(state),
  solutionCharts: solutionChartSelectors.getSolutionCharts(state),
  error: solutionChartSelectors.getError(state)
});

export default connect(mapStateToProps)(SolutionChart);
