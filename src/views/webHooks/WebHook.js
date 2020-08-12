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

import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import EditWebHook from 'views/webHooks/EditWebHook';
import SimpleModal from 'components/Modal/SimpleModal.jsx';

import * as actions from 'stores/webHook/actions';
import * as selectors from 'stores/webHook/reducer';
import CardButton from 'components/CardButton/CardButton';

class WebHook extends Component {
  state = {
    showInsertUpdateForm: false,
    inputFilter: '',
    showConfirmDeleteModal: false,
    itemToDelete: {}
  };

  componentDidMount() {
    this.props.dispatch(actions.allWebHooks());
    this.props.dispatch(actions.loadWebhookTypes());
  }

  onSaveClick(data) {
    if (this.state.editMode) {
      this.props.dispatch(actions.editWebHook(data));
    } else {
      this.props.dispatch(actions.createWebHook(data));
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
    this.props.dispatch(actions.deleteWebHook(this.state.itemToDelete.ID));
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

  render() {
    let columns = [];
    columns.push(col.addId());
    columns.push(col.addCol('name', 'Name', '20%'));
    columns.push(col.addCol('type', 'Type', '20%'));
    columns.push(col.addCol('url', 'URL', '30%'));
    columns.push(col.addEdit(this.onEdit));
    columns.push(col.addDelete(this.onDelete));
    const data = this.props.webHook.webHooks.filter(
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
          subTitle="Delete WebHook"
          message="Are you sure you want to delete this WebHook?"
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}
        ></SimpleModal>

        <Container fluid>
          <Row>
            <Col md={12}>
              <CardButton
                buttonName="New WebHook"
                handleClick={this.onClickNew.bind(this)}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              {this.state.showInsertUpdateForm ? (
                <EditWebHook
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
                  webHookTypes={this.props.webHook.webHookTypes}
                  environments={this.props.environments}
                />
              ) : null}
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <CardTenkai
                title="WebHooks"
                content={
                  <form>
                    <div className="col-md-8">
                      <FormGroup>
                        <FormLabel>WebHook Search</FormLabel>
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
                    <TenkaiTable columns={columns} data={data} />
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
  webHook: selectors.getWebHook(state),
  loading: selectors.getWebHookLoading(state),
  error: selectors.getWebHookError(state)
});

export default connect(mapStateToProps)(WebHook);
