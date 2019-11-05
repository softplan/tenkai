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
import ProductForm from "components/Forms/ProductForm.jsx";
import SimpleModal from "components/Modal/SimpleModal.jsx";

import * as productActions from "stores/product/actions";
import * as productSelectors from "stores/product/reducer";

class Product extends Component {
  state = {
    showInsertUpdateForm: false,
    inputFilter: "",
    showConfirmDeleteModal: false,
    itemToDelete: {}
  };

  componentDidMount() {
    this.props.dispatch(productActions.allProducts());
  }

  onSaveClick(data) {
    if (this.state.editMode) {
      this.props.dispatch(productActions.editProduct(data));
    } else {
      this.props.dispatch(productActions.createProduct(data));
    }

    this.setState({
      showInsertUpdateForm: false,
      editItem: {},
      editMode: false
    });
  }

  handleConfirmDelete() {
    this.props.dispatch(
      productActions.deleteProduct(this.state.itemToDelete.ID)
    );

    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  render() {
    const items = this.props.products
      .filter(
        d =>
          this.state.inputFilter === "" ||
          d.name.includes(this.state.inputFilter)
      )
      .map((item, key) => (
        <tr key={key}>
          <td>{item.ID}</td>
          <td>{item.name}</td>
          <td>
            <Button
              className="link-button"
              onClick={() => {
                this.setState({
                  showInsertUpdateForm: true,
                  editItem: item,
                  editMode: true
                });
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
                  pathname: "/admin/product-version",
                  search: "?productId=" + item.ID
                })
              }
            >
              <i className="pe-7s-album" />
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
          subTitle="Delete product"
          message="Are you sure you want to delete this product?"
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
                      New Product
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
                <ProductForm
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
                title="Products"
                content={
                  <form>
                    <div className="col-md-8">
                      <FormGroup>
                        <ControlLabel>Product Search</ControlLabel>
                        <FormControl
                          value={this.state.inputFilter}
                          onChange={e =>
                            this.setState({
                              inputFilter: e.target.value
                            })
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
                            <th>Product Name</th>
                            <th>Edit</th>
                            <th>Delete</th>
                            <th>Releases</th>
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
  loading: productSelectors.getLoading(state),
  products: productSelectors.getProducts(state),
  error: productSelectors.getError(state)
});

export default connect(mapStateToProps)(Product);
