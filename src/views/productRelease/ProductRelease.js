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
import TenkaiTable from 'components/Table/TenkaiTable';
import * as col from 'components/Table/TenkaiColumn';

import Button from 'components/CustomButton/CustomButton.jsx';
import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import EditProductRelease from 'views/productRelease/components/EditProductRelease';
import SimpleModal from 'components/Modal/SimpleModal.jsx';

import queryString from 'query-string';

import * as actions from 'stores/productRelease/actions';
import * as selectors from 'stores/productRelease/reducer';
import CardButton from 'components/CardButton/CardButton';

class ProductRelease extends Component {
  constructor(props) {
    super(props);
    const values = queryString.parse(props.location.search);
    this.state = {
      productId: values.productId,
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
    this.props.dispatch(actions.allProductReleases(this.state.productId));
  }

  handleConfirmDelete() {
    this.props.dispatch(
      actions.deleteProductRelease(
        this.state.itemToDelete.ID,
        this.state.productId
      )
    );

    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  onSaveClick(data) {
    data.productId = parseInt(this.state.productId);

    if (this.state.editMode) {
      this.props.dispatch(
        actions.editProductRelease(data, this.state.productId)
      );
    } else {
      this.props.dispatch(
        actions.createProductRelease(data, this.state.productId)
      );
    }

    this.setState({
      showInsertUpdateForm: false,
      editItem: {},
      editMode: false
    });
  }

  onLockVersion(data) {
    if (data.locked) {
      this.props.dispatch(
        actions.unlockProductRelease(data.ID, data.productId)
      );
    } else {
      this.props.dispatch(actions.lockProductRelease(data.ID, data.productId));
    }
  }

  getRowClassName(item) {
    if (item.locked) {
      return 'bg-disabled';
    }
    return '';
  }

  onClickNew() {
    this.setState({ showInsertUpdateForm: true });
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
      pathname: '/admin/product-version-service',
      search: '?productVersionId=' + item.ID
    });
  };

  lockButton = (cell, row) => {
    return (
      <Button
        className="link-button"
        variant={row.locked ? 'primary' : 'danger'}
        onClick={this.onLockVersion.bind(this, row)}
      >
        <i className={row.locked ? 'pe-7s-lock' : 'pe-7s-unlock'} />
        {row.locked ? 'Unlock' : 'Lock'}
      </Button>
    );
  };

  viewItemsButton = (cell, row) => {
    return (
      <Button
        className="link-button"
        onClick={() =>
          this.props.history.push({
            pathname: '/admin/product-version-service',
            search: '?productVersionId=' + row.ID
          })
        }
        disabled={!this.props.keycloak.hasRealmRole('tenkai-admin')}
      >
        <i className="pe-7s-news-paper cell-button-icon" />
      </Button>
    );
  };

  render() {
    let columns = [];
    columns.push(col.addId());
    columns.push(col.addCol('date', 'Date', '25%'));
    columns.push(col.addCol('version', 'Version', '25%'));
    columns.push(col.addColBtn('lock', 'Lock version', this.lockButton));
    columns.push(col.addEdit(this.onEdit));
    columns.push(col.addDelete(this.onDelete));
    columns.push(col.addColBtn('svc', 'Services', this.viewItemsButton));

    let data = this.props.productReleases.filter(
      d =>
        this.state.inputFilter === '' ||
        d.version.includes(this.state.inputFilter)
    );

    return (
      <div className="content">
        <SimpleModal
          showConfirmDeleteModal={this.state.showConfirmDeleteModal}
          handleConfirmDeleteModalClose={() =>
            this.setState({ showConfirmDeleteModal: false, itemToDelete: {} })
          }
          title="Confirm"
          subTitle="Delete release"
          message="Are you sure you want to delete this release?"
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}
        ></SimpleModal>

        <Container fluid>
          <Row>
            <Col md={12}>
              <CardButton
                buttonName="New Release"
                handleClick={this.onClickNew.bind(this)}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              {this.state.showInsertUpdateForm ? (
                <EditProductRelease
                  editMode={this.state.editMode}
                  handleLoading={this.props.handleLoading}
                  editItem={this.state.editItem}
                  saveClick={this.onSaveClick.bind(this)}
                  productReleases={this.props.productReleases}
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
                title="Releases"
                content={
                  <form>
                    <div>
                      <div className="col-md-8">
                        <FormGroup>
                          <FormLabel>Release Search</FormLabel>
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
  productReleases: selectors.getProductReleases(state)
});

export default connect(mapStateToProps)(ProductRelease);
