import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Container,
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormControl,
  Table
} from "react-bootstrap";
import SimpleModal from "components/Modal/SimpleModal.jsx";

import { CardTenkai } from "components/Card/CardTenkai.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import DepForm from "components/Dependencies/DepForm.jsx";
import queryString from "query-string";

import * as dependencyActions from "stores/dependency/actions";
import * as dependencySelectors from "stores/dependency/reducer";

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
      dependencyActions.allDependencies(this.state.releaseId)
    );
  }

  handleConfirmDelete() {
    this.props.dispatch(
      dependencyActions.deleteDependency(
        this.state.itemToDelete.ID,
        this.state.releaseId
      )
    );
    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  onSaveClick(data) {
    data.release_id = parseInt(this.state.releaseId);

    if (this.state.editMode) {
      this.props.dispatch(dependencyActions.editDependency(data));
    } else {
      this.props.dispatch(dependencyActions.createDependency(data));
    }

    this.setState({
      showInsertUpdateForm: false,
      editItem: {},
      editMode: false
    });
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

        <Container fluid>
          <Row>
            <Col md={12}>
              <CardTenkai
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
              <CardTenkai
                title="Dependencies"
                content={
                  <form>
                    <div>
                      <div className="col-md-8">
                        <FormGroup>
                          <FormLabel>Dependency Search</FormLabel>
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
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: dependencySelectors.getLoading(state),
  dependencies: dependencySelectors.getDependencies(state),
  error: dependencySelectors.getError(state)
});

export default connect(mapStateToProps)(Dependencies);
