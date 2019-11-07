import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Row,
  Col,
  FormControl,
  Table,
  FormGroup,
  ControlLabel
} from "react-bootstrap";

import Button from "components/CustomButton/CustomButton.jsx";
import { Card } from "components/Card/Card.jsx";
import CButton from "components/CustomButton/CustomButton.jsx";
import SolutionForm from "components/Solution/SolutionForm.jsx";
import SimpleModal from "components/Modal/SimpleModal.jsx";

import * as solutionActions from "stores/solution/actions";
import * as solutionSelectors from "stores/solution/reducer";

class Solution extends Component {
  state = {
    showInsertUpdateForm: false,
    inputFilter: "",
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

  render() {
    const items = this.props.solutions
      .filter(
        d =>
          this.state.inputFilter === "" ||
          d.name.includes(this.state.inputFilter)
      )
      .map((item, key) => (
        <tr key={key}>
          <td>{item.ID}</td>
          <td>{item.name}</td>
          <td>{item.team}</td>
          <td>
            <Button
              className="link-button"
              onClick={() => {
                this.setState(() => ({
                  showInsertUpdateForm: true,
                  editItem: item,
                  editMode: true
                }));
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
              onClick={() =>
                this.props.history.push({
                  pathname: "/admin/solution-deps",
                  search: "?solutionId=" + item.ID
                })
              }
            >
              <i className="pe-7s-album" />
            </Button>
          </td>
          <td>
            <Button
              className="link-button"
              onClick={() =>
                this.props.history.push({
                  pathname: "/admin/solution-deploy",
                  search: "?solutionId=" + item.ID
                })
              }
            >
              <i className="pe-7s-helm" />
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
          subTitle="Delete solution"
          message="Are you sure you want to delete this solution?"
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
                      New Solution
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
              <Card
                title="Solutions"
                content={
                  <form>
                    <div className="col-md-8">
                      <FormGroup>
                        <ControlLabel>Solution Search</ControlLabel>
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
                            <th>#</th>
                            <th>Solution Name</th>
                            <th>Team</th>
                            <th>Edit</th>
                            <th>Delete</th>
                            <th>Charts</th>
                            <th>Deploy</th>
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
  loading: solutionSelectors.getLoading(state),
  solutions: solutionSelectors.getSolutions(state),
  error: solutionSelectors.getError(state)
});

export default connect(mapStateToProps)(Solution);
