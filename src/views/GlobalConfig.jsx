import React, { Component } from "react";
import { Row, Col, ButtonToolbar } from "react-bootstrap";
import { CardTenkai } from "components/Card/CardTenkai.jsx";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { saveSettings, retrieveSettings } from "client-api/apicall.jsx";

class GlobalConfig extends Component {
  state = {
    formData: {
      commonValuesConfigMapChart: "",
      commonVariablesConfigMapChart: "",
      canaryChart: ""
    }
  };

  componentDidMount() {
    let data = [];
    data.push("commonValuesConfigMapChart");
    data.push("commonVariablesConfigMapChart");
    data.push("canaryChart");

    retrieveSettings({ list: data }, this, (result, self) => {
      let vCommonValuesConfigMapChart = "";
      let vCommonVariablesConfigMapChart = "";
      let vCanaryChart = "";

      for (let x = 0; x < result.List.length; x++) {
        let field = result.List[x].name;
        let value = result.List[x].value;

        if (field === "commonValuesConfigMapChart") {
          vCommonValuesConfigMapChart = value;
        } else {
          if (field === "commonVariablesConfigMapChart") {
            vCommonVariablesConfigMapChart = value;
          } else {
            if (field === "canaryChart") {
              vCanaryChart = value;
            }
          }
        }
      }

      self.setState({
        formData: {
          commonValuesConfigMapChart: vCommonValuesConfigMapChart,
          commonVariablesConfigMapChart: vCommonVariablesConfigMapChart,
          canaryChart: vCanaryChart
        }
      });
    });
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

  save() {
    let data = [];
    data.push({
      name: "commonValuesConfigMapChart",
      value: this.state.formData.commonValuesConfigMapChart
    });
    data.push({
      name: "commonVariablesConfigMapChart",
      value: this.state.formData.commonVariablesConfigMapChart
    });
    data.push({
      name: "canaryChart",
      value: this.state.formData.canaryChart
    });

    saveSettings({ list: data }, this, self => {
      this.props.handleNotification("custom", "success", "Saved!");
      console.log("saved");
    });
  }

  render() {
    return (
      <div className="content">
        <Row>
          <Col md={12}>
            <CardTenkai
              title=""
              content={
                <div align="right">
                  <ButtonToolbar style={{ display: 'block' }}>
                    <Button
                      className="btn-primary pull-right"
                      type="button"
                      onClick={this.save.bind(this)}
                    >
                      Save
                    </Button>
                  </ButtonToolbar>
                </div>
              }
            />
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <CardTenkai
              title="Settings"
              content={
                <div>
                  <form>
                    <FormInputs
                      ncols={["col-md-8"]}
                      properties={[
                        {
                          name: "commonValuesConfigMapChart",
                          label: "Common values Configmap Chart",
                          type: "text",
                          bsPrefix: "form-control",
                          value: this.state.formData.commonValuesConfigMapChart,
                          onChange: this.handleChange
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-8"]}
                      properties={[
                        {
                          name: "commonVariablesConfigMapChart",
                          label: "Common variables Configmap chart",
                          type: "text",
                          bsPrefix: "form-control",
                          value: this.state.formData
                            .commonVariablesConfigMapChart,
                          onChange: this.handleChange
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-8"]}
                      properties={[
                        {
                          name: "canaryChart",
                          label: "Canary chart",
                          type: "text",
                          bsPrefix: "form-control",
                          value: this.state.formData.canaryChart,
                          onChange: this.handleChange
                        }
                      ]}
                    />
                  </form>
                </div>
              }
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default GlobalConfig;
