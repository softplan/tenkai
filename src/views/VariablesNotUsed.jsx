import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormControl
} from "react-bootstrap";
import SimpleModal from "components/Modal/SimpleModal.jsx";
import axios from "axios";
import TENKAI_API_URL from "env.js";
import VariableCard from "components/Card/VariableCard.jsx";
import { CardTenkai } from "components/Card/CardTenkai.jsx";
import { getVariablesNotUsed } from "client-api/apicall.jsx";
import queryString from "query-string";

class VariablesNotUsed extends Component {
  state = {
    environmentName: "",
    locationSearch: "",
    showConfirmDeleteModal: false,
    itemToDelete: {},
    inputFilter: "",
    variablesNotUsed: []
  };

  componentDidMount() {
    if (this.props.location.state !== undefined) {
      let environmentName = this.props.location.state.item.name;
      this.setState({ environmentName: environmentName });
    }
    const values = queryString.parse(this.props.location.search);
    console.log(values.id);
    this.setState({ envId: values.id }, () => {
      this.handleClearVariables(this.state.envId);
    });
  }

  handleConfirmDeleteModalClose() {
    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  handleConfirmDeleteModalShow() {
    this.setState({ showConfirmDeleteModal: true });
  }

  handleNewClick(e) {
    this.setState({ showInsertUpdateForm: true });
  }

  handleClearVariables(envId) {
    getVariablesNotUsed(envId, this, (data, self) => {
      this.setState({ variablesNotUsed: data }, () => {
        console.log(data);
      });
    });
  }

  handleCancelClick(e) {
    this.setState(() => ({
      showInsertUpdateForm: false,
      editItem: {},
      editMode: false
    }));
  }

  onSaveClick(data) {}

  onChangeFilterHandler(e) {
    this.setState({
      inputFilter: e.target.value
    });
  }

  onDelete(item) {
    this.setState({ itemToDelete: item }, () => {
      this.handleConfirmDeleteModalShow();
    });
  }

  handleConfirmDelete() {
    if (this.state.itemToDelete !== undefined) {
      axios
        .delete(
          TENKAI_API_URL + "/variables/delete/" + this.state.itemToDelete.id
        )
        .then(this.handleClearVariables(this.state.envId))
        .catch(error => {
          console.log(error.message);
          this.props.handleNotification("general_fail", "error");
        });
    }
    this.setState({ showConfirmDeleteModal: false, itemToDelete: {} });
  }

  render() {
    const items = this.state.variablesNotUsed
      .filter(
        d =>
          this.state.inputFilter === "" ||
          d.value.includes(this.state.inputFilter) ||
          d.name.includes(this.state.inputFilter) ||
          d.scope.includes(this.state.inputFilter)
      )
      .map((item, key) => (
        <VariableCard
          key={key}
          item={item}
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

        <Container fluid>
          <Row>
            <Col md={12}>
              <CardTenkai
                title=""
                content={
                  <form>
                    <h3>
                      Variables in down services - Env:{" "}
                      {this.state.environmentName}{" "}
                    </h3>
                  </form>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <CardTenkai
                title="Variables"
                content={
                  <form>
                    <Row>
                      <div className="col-md-8">
                        <FormGroup>
                          <FormLabel>
                            Search by scope, name or value
                          </FormLabel>
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
        </Container>
      </div>
    );
  }
}

export default VariablesNotUsed;
