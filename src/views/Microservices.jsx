import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  FormGroup,
  FormLabel,
  Table,
  Button
} from "react-bootstrap";

import Select from "react-select";

import { CardTenkai } from "components/Card/CardTenkai.jsx";
import { ReleaseForm } from "components/Microservices/ReleaseForm.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SimpleModal from "components/Modal/SimpleModal.jsx";
import {
  retriveRepo,
  retrieveCharts,
  retrieveReleases,
  saveReleases,
  deleteRelease
} from "client-api/apicall.jsx";

class Microservices extends Component {
  state = {
    selectedChart: null,
    showInsertUpdateForm: false,
    charts: [],
    repositories: [],
    selectedRepository: {},
    releases: [],
    editMode: false,
    editItem: {},
    itemToDelete: {}
  };

  componentDidMount() {
    retriveRepo(this);
  }

  handleConfirmDeleteModalClose() {
    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  handleConfirmDeleteModalShow() {
    this.setState({ showConfirmDeleteModal: true });
  }

  handleConfirmDelete() {
    deleteRelease(this.state.itemToDelete.ID, this);
  }

  handleRepositoryChange = selectedRepository => {
    this.setState({ selectedRepository });
    retrieveCharts(this, selectedRepository.value, false);
  };

  handleChartChange = selectedChart => {
    this.setState({ selectedChart }, () => {
      retrieveReleases(selectedChart.value, this);
    });
  };

  handleDependenciesClick(id) {
    console.log(id);
    this.props.history.push({
      pathname: "/admin/microservices-deps",
      search: "?releaseId=" + id,
      state: { releaseName: this.state.selectedChart.value }
    });
  }

  handleNewReleaseClick(e) {
    this.setState({ showInsertUpdateForm: true });
  }

  handleCancelReleaseClick(e) {
    this.setState({ showInsertUpdateForm: false });
  }

  onDelete(item) {
    this.setState({ itemToDelete: item }, () => {
      this.handleConfirmDeleteModalShow();
    });
  }

  onSaveClick(data) {
    data.chartName = this.state.selectedChart.value;
    saveReleases(data, this);
  }

  render() {
    const { selectedChart } = this.state;
    const { selectedRepository } = this.state;

    const items = this.state.releases.map((item, key) => (
      <tr key={key}>
        <td>{item.release}</td>
        <td>
          <a href="#/">
            <FontAwesomeIcon
              icon="minus-circle"
              onClick={this.onDelete.bind(this, item)}
            />
          </a>
        </td>
        <td>
          <a href="#/">
            <FontAwesomeIcon
              icon="edit"
              onClick={this.handleDependenciesClick.bind(this, item.ID)}
            />
          </a>
        </td>
      </tr>
    ));

    return (
      <div className="content">
        <SimpleModal
          showConfirmDeleteModal={this.state.showConfirmDeleteModal}
          handleConfirmDeleteModalClose={this.handleConfirmDeleteModalClose.bind(
            this
          )}
          title="Confirm"
          subTitle="Delete release"
          message="Are you sure you want to delete this release?"
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}
        ></SimpleModal>

        <Container fluid>
          <Row>
            <Col md={12}>
              <CardTenkai
                title=""
                content={
                  <form>
                    <FormGroup>
                      <FormLabel>Repository</FormLabel>
                      <Select
                        value={selectedRepository}
                        onChange={this.handleRepositoryChange}
                        options={this.state.repositories}
                      />
                    </FormGroup>

                    <FormGroup>
                      <FormLabel>Helm Chart</FormLabel>
                      <Select
                        value={selectedChart}
                        onChange={this.handleChartChange}
                        options={this.state.charts}
                      />
                    </FormGroup>

                    <Button
                      className="pull-right"
                      variant="primary"
                      onClick={this.handleNewReleaseClick.bind(this)}
                    >
                      New Release
                    </Button>
                  </form>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              {this.state.showInsertUpdateForm ? (
                <ReleaseForm
                  editMode={this.state.editMode}
                  editItem={this.state.editItem}
                  saveClick={this.onSaveClick.bind(this)}
                  cancelClick={this.handleCancelReleaseClick.bind(this)}
                />
              ) : null}
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <CardTenkai
                title="Releases"
                category="Version number"
                content={
                  <div>
                    <Table bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>Release</th>
                          <th>Delete</th>
                          <th>Dependencies</th>
                        </tr>
                      </thead>
                      <tbody>{items}</tbody>
                    </Table>
                  </div>
                }
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Microservices;
