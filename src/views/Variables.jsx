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
import EditModal from "components/Modal/EditModal.jsx";
import queryString from "query-string";
import axios from "axios";
import TENKAI_API_URL from "env.js";
import VariableCard from "components/Card/VariableCard.jsx";
import { ButtonToolbar } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { VariablesForm } from "components/Environments/VariablesForm.jsx";

class Variables extends Component {
  state = {
    item: {},
    showInsertUpdateForm: false,
    variablesResult: { Variables: [] },
    environmentName: "",
    locationSearch: "",
    showConfirmDeleteModal: false,
    itemToDelete: {},
    inputFilter: "",
    showVariablesNotUsedModal: false,
    variablesNotUsed: []
  };

  componentDidMount() {
    let environmentName = "";
    if (this.props.location.state !== undefined) {
      environmentName = this.props.location.state.item.name;
    } else {
      this.props.history.push({
        pathname: "/admin/environments"
      });
    }
    let locationSearch = "";
    if (this.props.location.search !== undefined) {
      locationSearch = this.props.location.search;
    } else {
      this.props.history.push({
        pathname: "/admin/environments"
      });
    }
    this.setState(
      { environmentName: environmentName, locationSearch: locationSearch },
      () => {
        this.getScopedVariables();
      }
    );
  }

  navigateToNotUsedVariables() {
    const values = queryString.parse(this.state.locationSearch);

    this.props.history.push({
      pathname: "/admin/variablesNotUsed",
      search: "?id=" + values.id,
      state: { item: { name: this.state.environmentName } }
    });
  }

  handleConfirmDeleteModalClose() {
    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  handleConfirmDeleteModalShow() {
    this.setState({ showConfirmDeleteModal: true });
  }

  async getScopedVariables() {
    this.props.handleLoading(true);
    const values = queryString.parse(this.state.locationSearch);
    axios
      .get(TENKAI_API_URL + "/variables/" + values.id)
      .then(response => {
        this.setState({ variablesResult: response.data }, () => {
          this.props.handleLoading(false);
        });
      })
      .catch(error => {
        this.props.handleLoading(false);
        console.log(error.message);
        this.props.handleNotification("general_fail", "error");
      });
  }

  handleNewClick(e) {
    this.setState({ showInsertUpdateForm: true });
  }

  handleCancelClick(e) {
    this.setState(() => ({
      showInsertUpdateForm: false,
      editItem: {},
      editMode: false
    }));
  }

  onSaveClick(data) {
    if (this.state.editMode) {
      this.save(data, "/variables/edit");
    } else {
      this.save(data, "/variables");
    }
  }

  onChangeFilterHandler(e) {
    this.setState({
      inputFilter: e.target.value
    });
  }

  save(data, uri) {
    const values = queryString.parse(this.state.locationSearch);
    data.environmentId = parseInt(values.id);
    axios
      .post(TENKAI_API_URL + uri, { data })
      .then(res => {
        this.getScopedVariables();
      })
      .catch(error => {
        console.log(error.message);
        this.props.handleNotification("general_fail", "error");
      });

    this.setState({ editMode: false, showInsertUpdateForm: false });
  }

  navigateToEditEnvironment(item) {
    this.setState(() => ({
      showInsertUpdateForm: true,
      editItem: item,
      editMode: true
    }));
  }

  onDelete(item) {
    this.setState({ itemToDelete: item }, () => {
      this.handleConfirmDeleteModalShow();
    });
  }

  handleVariablesNotUsedModal() {
    this.setState({ showVariablesNotUsedModal: false });
  }

  handleConfirmDelete() {
    if (this.state.itemToDelete !== undefined) {
      axios
        .delete(
          TENKAI_API_URL + "/variables/delete/" + this.state.itemToDelete.ID
        )
        .then(this.getScopedVariables())
        .catch(error => {
          console.log(error.message);
          this.props.handleNotification("general_fail", "error");
        });
    }
    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  render() {
    const notUsedRender = this.state.variablesNotUsed.map((item, key) => {
      return (
        <tr key={key}>
          <td>{item.scope}</td>
          <td>{item.name}</td>
          <td>{item.value}</td>
        </tr>
      );
    });

    const items = this.state.variablesResult.Variables.filter(
      d =>
        this.state.inputFilter === "" ||
        d.value.includes(this.state.inputFilter) ||
        d.name.includes(this.state.inputFilter) ||
        d.scope.includes(this.state.inputFilter)
    ).map((item, key) => (
      <VariableCard
        key={key}
        item={item}
        navigateToEditEnvironment={this.navigateToEditEnvironment.bind(
          this,
          item
        )}
        onDelete={this.onDelete.bind(this, item)}
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
          subTitle="Delete variable"
          message="Are you sure you want to delete this variable?"
          handleConfirmDelete={this.handleConfirmDelete.bind(this)}
        ></SimpleModal>

        <EditModal
          title="Edit Variable"
          onClose={this.handleCancelClick.bind(this)}
          onShow={this.state.editMode}
          form={
            <VariablesForm
              saveClick={this.onSaveClick.bind(this)}
              editItem={this.state.editItem}
              editMode={this.state.editMode}
              cancelClick={this.handleCancelClick.bind(this)}
            />
          }
        />

        <EditModal
          title="Variables in down services"
          onClose={this.handleVariablesNotUsedModal.bind(this)}
          onShow={this.state.showVariablesNotUsedModal}
          form={
            <Table striped hover>
              <thead>
                <tr>
                  <th>Scope</th>
                  <th>Variable</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>{notUsedRender}</tbody>
            </Table>
          }
        />

        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title=""
                content={
                  <form>
                    <h3>Environment: {this.state.environmentName}</h3>

                    <ButtonToolbar>
                      <Button
                        className="pull-right"
                        variant="primary"
                        onClick={this.handleNewClick.bind(this)}
                      >
                        New Variable
                      </Button>

                      <Button
                        className="btn-danger pull-right"
                        variant="primary"
                        onClick={this.navigateToNotUsedVariables.bind(this)}
                      >
                        List variables in down services (not used)
                      </Button>
                    </ButtonToolbar>

                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              {this.state.showInsertUpdateForm && !this.state.editMode ? (
                <VariablesForm
                  saveClick={this.onSaveClick.bind(this)}
                  editItem={this.state.editItem}
                  editMode={this.state.editMode}
                  cancelClick={this.handleCancelClick.bind(this)}
                />
              ) : null}
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Card
                title="Variables"
                content={
                  <form>
                    <Row>
                      <div className="col-md-8">
                        <FormGroup>
                          <ControlLabel>
                            Search by scope, name or value
                          </ControlLabel>
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
                    </Row>

                    <Row>
                      <Col xs={12}>{items}</Col>
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

export default Variables;
