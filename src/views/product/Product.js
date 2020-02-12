import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Row,
  Col,
  FormControl,
  FormGroup,
  FormLabel
} from 'react-bootstrap';

import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import EditProduct from 'views/product/components/EditProduct';
import SimpleModal from 'components/Modal/SimpleModal.jsx';

import * as actions from 'stores/product/actions';
import * as selectors from 'stores/product/reducer';
import CardButton from 'components/CardButton/CardButton';
import TenkaiTable from 'components/Table/TenkaiTable';

class Product extends Component {
  state = {
    showInsertUpdateForm: false,
    inputFilter: '',
    showConfirmDeleteModal: false,
    itemToDelete: {}
  };

  componentDidMount() {
    this.props.dispatch(actions.allProducts());
  }

  onSaveClick(data) {
    if (this.state.editMode) {
      this.props.dispatch(actions.editProduct(data));
    } else {
      this.props.dispatch(actions.createProduct(data));
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
    this.props.dispatch(actions.deleteProduct(this.state.itemToDelete.ID));
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

  onViewItems = item => {
    this.props.history.push({
      pathname: '/admin/product-version',
      search: '?productId=' + item.ID
    });
  };

  render() {
    const columns = [
      {
        dataField: 'name',
        text: 'Product Name',
        sort: true
      }
    ];

    let data = this.props.products.filter(
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
                    <TenkaiTable
                      columns={columns}
                      data={data}
                      edit={this.onEdit}
                      delete={this.onDelete}
                      viewItems={this.onViewItems}
                    />
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
  products: selectors.getProducts(state)
});

export default connect(mapStateToProps)(Product);
