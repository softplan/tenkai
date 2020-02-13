import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormControl,
  ButtonToolbar
} from 'react-bootstrap';
import TenkaiTable from 'components/Table/TenkaiTable';
import * as col from 'components/Table/TenkaiColumn';
import SimpleModal from 'components/Modal/SimpleModal.jsx';

import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import Button from 'components/CustomButton/CustomButton.jsx';
import EditProductReleaseService from 'views/productReleaseService/components/EditProductReleaseService';
import queryString from 'query-string';

import * as actions from 'stores/productReleaseService/actions';
import * as selectors from 'stores/productReleaseService/reducer';
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
      actions.allProductReleaseServices(this.state.productVersionId)
    );
  }

  handleConfirmDelete() {
    this.props.dispatch(
      actions.deleteProductReleaseService(
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
        actions.editProductReleaseService(data, this.state.productVersionId)
      );
    } else {
      this.props.dispatch(
        actions.createProductReleaseService(data, this.state.productVersionId)
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

  latestChartButton = (cell, row) => {
    if (row.chartLatestVersion !== '') {
      return (
        <Container fluid>
          <Button
            className="link-button"
            onClick={this.setChartLatestVersion.bind(this, row)}
            disabled={this.state.locked}
          >
            <i className="pe-7s-left-arrow cell-button-icon" />
          </Button>
          <span>{row.chartLatestVersion}</span>
        </Container>
      );
    } else {
      return <span>{row.chartLatestVersion}</span>;
    }
  };

  latestImageTag = (cell, row) => {
    if (row.latestVersion !== '') {
      return (
        <Container>
          <Button
            className="link-button"
            onClick={this.setVersion.bind(this, row)}
            disabled={this.state.locked}
          >
            <i className="pe-7s-left-arrow cell-button-icon" />
          </Button>
          <span>{row.latestVersion}</span>
        </Container>
      );
    } else {
      return <span>{row.latestVersion}</span>;
    }
  };

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

  goToDeployButton = (cell, row) => {
    return (
      <Button
        className="link-button"
        onClick={this.goToServiceDeploy.bind(this, row)}
      >
        <i className="pe-7s-news-paper cell-button-icon" />
      </Button>
    );
  };

  render() {
    let columns = [];
    columns.push(col.addId());
    columns.push(col.addCol('serviceName', 'Chart Name', '30%'));
    columns.push(
      col.addColBtn(
        'chartLatestVersion',
        'Latest Chart',
        this.latestChartButton
      )
    );
    columns.push(col.addCol('dockerImageTag', 'Desired Image Tag'));
    columns.push(
      col.addColBtn('latestVersion', 'Latest Image Tag', this.latestImageTag)
    );
    columns.push(col.addEdit(this.onEdit));
    columns.push(col.addDelete(this.onDelete));
    columns.push(
      col.addColBtn('goDeploy', 'Go To Deploy', this.goToDeployButton)
    );

    let data = this.props.productReleaseServices.filter(
      d =>
        this.state.inputFilter === '' ||
        d.serviceName.includes(this.state.inputFilter)
    );

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
  productReleaseServices: selectors.getProductReleaseServices(state),
  productReleases: productReleaseSelectors.getProductReleases(state)
});

export default connect(mapStateToProps)(ProductReleaseService);
