import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { Button, Row, Col, Checkbox } from "react-bootstrap";

export class ProductReleaseForm extends Component {
  state = {
    formData: {
      ID: "",
      version: ""
    }
  };

  componentDidMount() {
    if (this.props.editItem) {
      this.setState(() => ({
        formData: this.props.editItem
      }));
    } else {
      this.setState(() => ({
        formData: {}
      }));
    }
  }

  handleChange = event => {
    const { value, name } = event.target;
    this.setState(state => ({
      formData: {
        ...state.formData,
        [name]: value
      }
    }));
  };

  saveClick = event => {
    event.preventDefault();
    const data = this.state.formData;
    this.props.saveClick(data);
  };

  render() {
    const { editMode } = this.props;

    return (
      <div>
        <Card
          title={editMode ? "Edit Product Release" : "New Product Release"}
          content={
            <form>
              <Row>
                <Col md={12}>
                  <FormInputs
                    ncols={["col-md-3"]}
                    properties={[
                      {
                        name: "version",
                        label: "Version",
                        type: "text",
                        bsClass: "form-control",
                        value: this.state.formData.version,
                        onChange: this.handleChange
                      }
                    ]}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Checkbox inline>
                    Associate services from latest version
                  </Checkbox>{" "}
                </Col>
              </Row>
              <Row>
                <Col md={6}> </Col>
              </Row>

              <div className="btn-toolbar">
                <div className="btn-group">
                  <Button bsStyle="info" type="button" onClick={this.saveClick}>
                    Save
                  </Button>
                </div>
                <div className="btn-group">
                  <Button
                    bsStyle="info"
                    type="button"
                    onClick={this.props.cancelClick}
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              <div className="clearfix" />
            </form>
          }
        />
      </div>
    );
  }
}

export default ProductReleaseForm;
