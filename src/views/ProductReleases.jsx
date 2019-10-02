import React, { Component } from "react";
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
import ProductReleaseForm from "components/Forms/ProductReleaseForm.jsx";
import queryString from "query-string";
import {
  saveProductRelease,
  retrieveProductVersions
} from "client-api/product-apicall";

class ProductRelease extends Component {
  constructor(props) {
    super(props);
    const values = queryString.parse(props.location.search);
    this.state = {
      productId: values.productId,
      item: {},
      showInsertUpdateForm: false,
      list: [],
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
    retrieveProductVersions(this.state.productId, this);
  }

  handleConfirmDeleteModalClose() {
    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  handleNewClick(e) {
    this.setState({ showInsertUpdateForm: true });
  }

  onChangeFilterHandler(e) {
    this.setState({
      inputFilter: e.target.value
    });
  }

  handleConfirmDelete() {
    //deleteSolutionChart(this.state.itemToDelete.ID, this);
  }

  onSaveClick(data) {
    data.productId = parseInt(this.state.productId);
    saveProductRelease(data, this, self => {
      retrieveProductVersions(self.state.productId, self);
      self.setState(() => ({
        showInsertUpdateForm: false,
        editItem: {},
        editMode: false
      }));
    });
  }

  handleCancelClick(e) {
    this.setState(() => ({
      showInsertUpdateForm: false,
      editItem: {},
      editMode: false
    }));
  }

  handleConfirmDeleteModalShow() {
    this.setState({ showConfirmDeleteModal: true });
  }

  onDelete(item) {
    this.setState({ itemToDelete: item }, () => {
      this.handleConfirmDeleteModalShow();
    });
  }

  onEditDetails(item) {
    this.props.history.push({
      pathname: "/admin/product-version-service",
      search: "?productVersionId=" + item.ID
    });
  }

  render() {
    const items = this.state.list
      .filter(
        d =>
          this.state.inputFilter === "" ||
          d.chartName.includes(this.state.inputFilter)
      )
      .map((item, key) => (
        <tr key={key}>
          <td>{item.date}</td>
          <td>{item.version}</td>
          <td>
            <Button
              className="link-button"
              onClick={this.onDelete.bind(this, item)}
            >
              <i className="pe-7s-trash" />
            </Button>
          </td>
          <td>
            <Button
              className="link-button"
              onClick={this.onEditDetails.bind(this, item)}
            >
              <i className="pe-7s-news-paper" />
            </Button>
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

        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title=""
                content={
                  <form>
                    <h2>{this.state.productName}</h2>
                    <Button
                      className="pull-right"
                      variant="primary"
                      onClick={this.handleNewClick.bind(this)}
                    >
                      New Release
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
                <ProductReleaseForm
                  editMode={this.state.editMode}
                  handleLoading={this.props.handleLoading}
                  editItem={this.state.editItem}
                  saveClick={this.onSaveClick.bind(this)}
                  cancelClick={this.handleCancelClick.bind(this)}
                />
              ) : null}
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Card
                title="Releases"
                content={
                  <form>
                    <div>
                      <div className="col-md-8">
                        <FormGroup>
                          <ControlLabel>Release Search</ControlLabel>
                          <FormControl
                            value={this.state.inputFilter}
                            onChange={this.onChangeFilterHandler.bind(this)}
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
                              <th>Date</th>
                              <th>Version</th>
                              <th>Delete</th>
                              <th>Services</th>
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

export default ProductRelease;
