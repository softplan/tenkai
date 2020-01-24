import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormControl,
  Table,
  ButtonToolbar
} from 'react-bootstrap';
import SimpleModal from 'components/Modal/SimpleModal.jsx';

import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import Button from 'components/CustomButton/CustomButton.jsx';
import EditProductReleaseService from 'views/productReleaseService/components/EditProductReleaseService';
import queryString from 'query-string';

import * as productReleaseServiceActions from 'stores/productReleaseService/actions';
import * as productReleaseServiceSelectors from 'stores/productReleaseService/reducer';
import * as productReleaseSelectors from 'stores/productRelease/reducer';

class ProductReleaseService extends Component {
  constructor(props) {
    super(props);
    const values = queryString.parse(props.location.search);
    this.state = {
      productVersionId: values.productVersionId,
      item: {},
      showInsertUpdateForm: false,
      header: '',
      showConfirmDeleteModal: false,
      itemToDelete: {},
      inputFilter: '',
      editMode: false,
      editItem: {},
      ProductName: '',
      Version: '',
      locked: this.isLocked()
    };
  }

  isLocked() {
    const pvid = parseInt(
      queryString.parse(this.props.location.search).productVersionId
    );
    const productRelease = this.props.productReleases.find(
      pr => pr.ID === pvid
    );
    return productRelease ? productRelease.locked : false;
  }

  componentDidMount() {
    this.props.dispatch(
      productReleaseServiceActions.allProductReleaseServices(
        this.state.productVersionId
      )
    );
  }

  handleConfirmDelete() {
    this.props.dispatch(
      productReleaseServiceActions.deleteProductReleaseService(
        this.state.itemToDelete.ID,
        this.state.productVersionId
      )
    );

    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  onSaveClick(data) {
    data.productVersionId = parseInt(this.state.productVersionId);

    if (this.state.editMode) {
      this.props.dispatch(
        productReleaseServiceActions.editProductReleaseService(
          data,
          this.state.productVersionId
        )
      );
    } else {
      this.props.dispatch(
        productReleaseServiceActions.createProductReleaseService(
          data,
          this.state.productVersionId
        )
      );
    }

    this.setState({
      showInsertUpdateForm: false,
      editItem: {},
      editMode: false
    });
  }

  goToDeploy() {
    this.props.handleLoading(true);
    let array = [];
    let services = this.props.productReleaseServices;
    for (var i = 0; i < services.length; i++) {
      let item = services[i];
      let serviceName = this.getChartName(item.serviceName);
      let serviceVersion = this.getChartVersion(item.serviceName);
      let chart =
        serviceName + '@' + serviceVersion + '#' + item.dockerImageTag;
      array.push(chart);
    }
    this.props.handleLoading(false);
    this.props.updateSelectedChartsToDeploy(array, () => {
      this.props.history.push({
        pathname: '/admin/deployment-wvars',
        search: '?productVersionId=' + this.state.productVersionId
      });
    });
  }

  goToServiceDeploy(item) {
    let serviceName = this.getChartName(item.serviceName);
    let serviceVersion = this.getChartVersion(item.serviceName);
    let chart = serviceName + '@' + serviceVersion + '#' + item.dockerImageTag;

    let array = [];
    array.push(chart);

    this.props.updateSelectedChartsToDeploy(array, () => {
      this.props.history.push({
        pathname: '/admin/deployment-wvars'
      });
    });
  }

  setVersion(item) {
    item.dockerImageTag = item.latestVersion;
    this.setState({ editMode: true, editItem: item }, () => {
      this.onSaveClick(item);
    });
  }

  setChartLatestVersion(item) {
    item.serviceName =
      this.getChartName(item.serviceName) + ' - ' + item.chartLatestVersion;
    this.setState({ editMode: true, editItem: item }, () => {
      this.onSaveClick(item);
    });
  }

  getChartName(chartNameVersion) {
    let splited = chartNameVersion.split(' - ');
    return splited.length >= 1 ? splited[0] : '';
  }

  getChartVersion(chartNameVersion) {
    let splited = chartNameVersion.split(' - ');
    return splited.length === 2 ? splited[1] : '';
  }

  render() {
    const items = this.props.productReleaseServices
      .filter(
        d =>
          this.state.inputFilter === '' ||
          d.serviceName.includes(this.state.inputFilter)
      )
      .map((item, key) => (
        <tr key={key}>
          <td>{item.ID}</td>
          <td>{item.serviceName}</td>
          <td>
            {item.chartLatestVersion !== '' ? (
              <Button
                className="link-button"
                onClick={this.setChartLatestVersion.bind(this, item)}
                disabled={this.state.locked}
              >
                <i className="pe-7s-left-arrow" />
              </Button>
            ) : null}
            {item.chartLatestVersion}
          </td>
          <td>{item.dockerImageTag}</td>
          <td>
            {item.latestVersion !== '' ? (
              <Button
                className="link-button"
                onClick={this.setVersion.bind(this, item)}
                disabled={this.state.locked}
              >
                <i className="pe-7s-left-arrow" />
              </Button>
            ) : null}
            {item.latestVersion}
          </td>
          <td>
            <Button
              className="link-button"
              disabled={this.state.locked}
              onClick={() =>
                this.setState({
                  showInsertUpdateForm: true,
                  editItem: item,
                  editMode: true
                })
              }
            >
              <i className="pe-7s-edit" />
            </Button>
          </td>

          <td>
            <Button
              className="link-button"
              disabled={this.state.locked}
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
              onClick={this.goToServiceDeploy.bind(this, item)}
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
          handleConfirmDeleteModalClose={() =>
            this.setState({ showConfirmDeleteModal: false, itemToDelete: {} })
          }
          title="Confirm"
          subTitle="Delete chart association"
          message="Are you sure you want to delete this chart association?"
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}
        ></SimpleModal>

        <Container fluid>
          <Row>
            <Col md={12}>
              <CardTenkai
                title=""
                content={
                  <Container fluid>
                    <h2>{this.state.solutionName}</h2>
                    <div align="right">
                      <ButtonToolbar style={{ display: 'block' }}>
                        <Button
                          className="btn-primary pull-right"
                          variant="primary"
                          onClick={this.goToDeploy.bind(this)}
                        >
                          Go to deploy
                        </Button>

                        <Button
                          className="pull-right"
                          variant="primary"
                          disabled={this.state.locked}
                          onClick={() =>
                            this.setState({ showInsertUpdateForm: true })
                          }
                        >
                          Associate Chart
                        </Button>
                      </ButtonToolbar>
                    </div>
                  </Container>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              {this.state.showInsertUpdateForm ? (
                <EditProductReleaseService
                  editMode={this.state.editMode}
                  handleLoading={this.props.handleLoading}
                  handleNotification={this.props.handleNotification}
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
                title="Charts"
                content={
                  <form>
                    <div>
                      <div className="col-md-8">
                        <FormGroup>
                          <FormLabel>Charts Search</FormLabel>
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

                      <div>
                        <Table bordered hover size="sm">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Chart Name</th>
                              <th>Latest Chart</th>
                              <th>Desired Image Tag</th>
                              <th>Latest Image Tag</th>
                              <th>Edit</th>
                              <th>Delete</th>
                              <th>Go Deploy</th>
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
  loading: productReleaseServiceSelectors.getLoading(state),
  productReleaseServices: productReleaseServiceSelectors.getProductReleaseServices(
    state
  ),
  error: productReleaseServiceSelectors.getError(state),
  productReleases: productReleaseSelectors.getProductReleases(state)
});

export default connect(mapStateToProps)(ProductReleaseService);
