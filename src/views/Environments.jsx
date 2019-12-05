import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  Row,
  Col,
  FormControl,
  FormGroup,
  ControlLabel
} from 'react-bootstrap';

import { Card } from 'components/Card/Card.jsx';
import CButton from 'components/CustomButton/CustomButton.jsx';
import EnvironmentForm from 'components/Environments/EnvironmentForm.jsx';
import SimpleModal from 'components/Modal/SimpleModal.jsx';
import EnvironmentCard from 'components/Card/EnvironmentCard.jsx';

import * as environmentActions from 'stores/environment/actions';
import * as environmentSelectors from 'stores/environment/reducer';

class Environments extends Component {
  state = {
    showInsertUpdateForm: false,
    inputFilter: '',
    showConfirmDeleteModal: false,
    showConfirmDuplicateModal: false,
    itemToDelete: {},
    itemToDuplicate: {}
  };

  componentDidMount() {
    this.props.dispatch(environmentActions.allEnvironments());
  }

  handleConfirmDeleteModalClose() {
    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  handleConfirmDeleteModalShow() {
    this.setState({ showConfirmDeleteModal: true });
  }

  handleConfirmDuplicateModalClose() {
    this.setState({ showConfirmDuplicateModal: false, itemToDuplicate: {} });
  }

  handleConfirmDuplicateModalShow() {
    this.setState({ showConfirmDuplicateModal: true });
  }

  onChangeFilterHandler(e) {
    this.setState({
      inputFilter: e.target.value
    });
  }

  navigateToEnvironmentVariables(id, group, name) {
    this.props.history.push({
      pathname: '/admin/environments-envvars',
      search: '?id=' + id,
      state: { item: { group: group, name: name } }
    });
  }

  navigateToEditEnvironment(item) {
    this.setState(() => ({
      showInsertUpdateForm: true,
      editItem: item,
      editMode: true
    }));
    window.scrollTo(0, 0);
  }

  handleNewEnvironmentClick(e) {
    this.setState(() => ({
      showInsertUpdateForm: true,
      editItem: {},
      editMode: false
    }));
  }

  handleCancelEnvironmentClick(e) {
    this.setState(() => ({
      showInsertUpdateForm: false,
      editItem: {},
      editMode: false
    }));
  }

  onSaveClick(data) {
    if (this.state.editMode) {
      this.props.dispatch(environmentActions.editEnvironment(data));
    } else {
      this.props.dispatch(environmentActions.createEnvironment(data));
    }

    this.setState({
      showInsertUpdateForm: false,
      editItem: {},
      editMode: false
    });
  }

  duplicateEnvironment(item) {
    this.setState({ itemToDuplicate: item }, () => {
      console.log(this.state.itemToDuplicate);
      this.handleConfirmDuplicateModalShow();
    });
  }

  handleConfirmDuplicate() {
    this.props.dispatch(
      environmentActions.duplicateEnvironment(this.state.itemToDuplicate.ID)
    );
    this.setState({ showConfirmDuplicateModal: false, itemToDuplicate: {} });
  }

  onDelete(item) {
    this.setState({ itemToDelete: item }, () => {
      this.handleConfirmDeleteModalShow();
    });
  }

  handleConfirmDelete() {
    this.props.dispatch(
      environmentActions.deleteEnvironment(this.state.itemToDelete.ID)
    );
    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  onExport(item) {
    this.props.dispatch(environmentActions.exportEnvironment(item));
  }

  render() {
    const items = this.props.environments
      .filter(
        d =>
          this.state.inputFilter === '' ||
          d.name.includes(this.state.inputFilter)
      )
      .map((item, key) => (
        <EnvironmentCard
          key={item.ID}
          id={item.id}
          keycloak={this.props.keycloak}
          item={item}
          group={item.group}
          name={item.name}
          clusterUri={item.cluster_uri}
          namespace={item.namespace}
          navigateToEditEnvironment={this.navigateToEditEnvironment.bind(this)}
          navigateToEnvironmentVariables={this.navigateToEnvironmentVariables.bind(
            this
          )}
          duplicateEnvironment={this.duplicateEnvironment.bind(this)}
          onDelete={this.onDelete.bind(this)}
          onExport={this.onExport.bind(this)}
        />
      ));

    return (
      <div className="content">
        <SimpleModal
          showConfirmDeleteModal={this.state.showConfirmDeleteModal}
          handleConfirmDeleteModalClose={this.handleConfirmDeleteModalClose.bind(
            this
          )}
          title="Confirm"
          subTitle="Delete environment"
          message="Are you sure you want to delete this environment?"
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}
        ></SimpleModal>

        <SimpleModal
          showConfirmDeleteModal={this.state.showConfirmDuplicateModal}
          handleConfirmDeleteModalClose={this.handleConfirmDuplicateModalClose.bind(
            this
          )}
          title="Confirm"
          subTitle="Duplicate environment"
          message="Are you sure you want to duplicate this environment?"
          handleConfirmDelete={this.handleConfirmDuplicate.bind(this)}
        ></SimpleModal>

        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title=""
                content={
                  <form>
                    <CButton
                      disabled={
                        !this.props.keycloak.hasRealmRole('tenkai-admin')
                      }
                      className="pull-right"
                      variant="primary"
                      onClick={this.handleNewEnvironmentClick.bind(this)}
                    >
                      New Environment
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
                <EnvironmentForm
                  editMode={this.state.editMode}
                  editItem={this.state.editItem}
                  saveClick={this.onSaveClick.bind(this)}
                  cancelClick={this.handleCancelEnvironmentClick.bind(this)}
                />
              ) : null}
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Card
                plain
                title="Environments"
                content={
                  <form>
                    <Row>
                      <Col xs={8}>
                        <FormGroup>
                          <ControlLabel>Environment Search</ControlLabel>
                          <FormControl
                            value={this.state.inputFilter}
                            onChange={this.onChangeFilterHandler.bind(this)}
                            style={{ width: '100%' }}
                            type="text"
                            placeholder="Search using any field"
                            aria-label="Search using any field"
                          ></FormControl>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={8}>{items}</Col>
                    </Row>
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
  loading: environmentSelectors.getLoading(state),
  environments: environmentSelectors.getEnvironments(state),
  error: environmentSelectors.getError(state)
});

export default connect(mapStateToProps)(Environments);
