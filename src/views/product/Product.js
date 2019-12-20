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

import Button from 'components/CustomButton/CustomButton.jsx';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import EditProduct from 'views/product/components/EditProduct';
import SimpleModal from 'components/Modal/SimpleModal.jsx';

import * as productActions from 'stores/product/actions';
import * as productSelectors from 'stores/product/reducer';
import CardButton from 'components/CardButton/CardButton';

class Product extends Component {
  state = {
    showInsertUpdateForm: false,
    inputFilter: '',
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

  onClickNew() {
    this.setState({
      showInsertUpdateForm: true,
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
          this.state.inputFilter === '' ||
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
                  pathname: '/admin/product-version',
                  search: '?productId=' + item.ID
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

        <Container fluid>
          <Row>
            <Col md={12}>
              <CardButton
                buttonName="New Product"
                handleClick={this.onClickNew.bind(this)}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              {this.state.showInsertUpdateForm ? (
                <EditProduct
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
                title="Products"
                content={
                  <form>
                    <div className="col-md-8">
                      <FormGroup>
                        <FormLabel>Product Search</FormLabel>
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
        </Container>
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
