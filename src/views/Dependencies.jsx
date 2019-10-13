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
import DepForm from "components/Dependencies/DepForm.jsx";
import queryString from "query-string";
import {
  retrieveDependencies,
  saveDependency,
  deleteDependency
} from "client-api/apicall.jsx";

import * as dependencieActions from "stores/dependencie/actions";
import * as dependencieSelectors from "stores/dependencie/reducer";

class Dependencies extends Component {
  constructor(props) {
    super(props);
    const values = queryString.parse(props.location.search);
    const releaseName = props.location.state.releaseName;
    this.state = {
      releaseId: values.releaseId,
      item: {},
      showInsertUpdateForm: false,
      list: [],
      showConfirmDeleteModal: false,
      itemToDelete: {},
      inputFilter: "",
      editMode: false,
      editItem: {},
      releaseName: releaseName
    };
  }

  componentDidMount() {
    this.props.dispatch(
      dependencieActions.allDependencies(this.state.releaseId)
    );
  }

  handleConfirmDelete() {
    deleteDependency(this.state.itemToDelete.ID, this);
  }

  onSaveClick(data) {
    data.release_id = parseInt(this.state.releaseId);
    saveDependency(data, this);
  }

  render() {
    const items = this.props.dependencies
      .filter(
        d =>
          this.state.inputFilter === "" ||
          d.chartName.includes(this.state.inputFilter)
      )
      .map((item, key) => (
        <tr key={key}>
          <td>{item.chartName}</td>
          <td>{item.version}</td>

          <td>
            <Button
              className="link-button"
              onClick={() =>
                this.setState({
                  itemToDelete: item,
                  showConfirmDeleteModal: true
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
          subTitle="Delete dependency"
          message="Are you sure you want to delete this dependency?"
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}
        />

        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title=""
                content={
                  <form>
                    <h2>{this.state.releaseName}</h2>
                    <Button
                      className="pull-right"
                      variant="primary"
                      onClick={() =>
                        this.setState({ showInsertUpdateForm: true })
                      }
                    >
                      New Dependency
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
                <DepForm
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
                title="Dependencies"
                content={
                  <form>
                    <div>
                      <div className="col-md-8">
                        <FormGroup>
                          <ControlLabel>Dependency Search</ControlLabel>
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
                              <th>Version (Tag)</th>
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
  loading: dependencieSelectors.getLoading(state),
  dependencies: dependencieSelectors.getDependencies(state),
  error: dependencieSelectors.getError(state)
});

export default connect(mapStateToProps)(Dependencies);
