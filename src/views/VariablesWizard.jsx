import React, { Component } from "react";
import { Grid, Row, Col, ButtonToolbar } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import HelmVariables from "components/Deployment/HelmVariables.jsx";
import CopyModal from "components/Modal/CopyModal.jsx";
import { multipleInstall, getHelmCommand } from "client-api/apicall.jsx";
import HelmCommandModal from "components/Modal/HelmCommandModal.jsx";

class VariablesWizard extends Component {
  state = {
    envId: "",
    charts: [],
    chartVersions: new Map(),
    onShowCopyModal: false,
    desiredTags: new Map(),
    showEditorModal: false,
    helmValue: ""
  };

  componentDidMount() {
    this.props.handleLoading(true);
    let total = this.props.selectedChartsToDeploy.length;
    let chartsToDeploy = this.props.selectedChartsToDeploy;
    let helmCharts = [];
    let chartVersion = "";
    let value = "";
    let chartVersions = new Map();
    let desiredTags = new Map();
    for (let i = 0; i < total; i++) {
      value = chartsToDeploy[i].substring(0, chartsToDeploy[i].indexOf("@"));
      helmCharts.push(value);

      if (chartsToDeploy[i].indexOf("#") > 0) {
        let dockerImage = chartsToDeploy[i].substring(
          chartsToDeploy[i].indexOf("#") + 1,
          chartsToDeploy[i].length
        );
        desiredTags[value] = dockerImage;

        chartVersion = chartsToDeploy[i].substring(
          chartsToDeploy[i].indexOf("@") + 1,
          chartsToDeploy[i].indexOf("#")
        );
        chartVersions[value] = chartVersion;
      } else {
        chartVersion = chartsToDeploy[i].substring(
          chartsToDeploy[i].indexOf("@") + 1,
          chartsToDeploy[i].length
        );
        chartVersions[value] = chartVersion;
      }
    }
    this.setState(
      {
        charts: helmCharts,
        chartVersions: chartVersions,
        desiredTags: desiredTags
      },
      async () => {
        await this.getChildVariables();
        this.props.handleLoading(false);
      }
    );
  }

  async getChildVariables() {
    for (let x = 0; x < this.state.charts.length; x++) {
      let chartName = this.state.charts[x];
      await this.refs["h" + x].getVariables(
        chartName,
        this.state.chartVersions[chartName]
      );
    }
  }

  constructor(props) {
    super(props);
    this.state.envId = this.props.selectedEnvironment.value;
  }

  onSave = payload => {
    multipleInstall(payload, this);
  };

  onSaveVariablesClick = () => {
    this.props.handleLoading(true);
    let count = this.state.charts.length;
    let index = 0;

    this.state.charts.forEach((item, key) => {
      this.refs["h" + key].save(data => {
        index++;
        if (index >= count) {
          this.props.handleNotification(
            "custom",
            "success",
            "Variables saved!"
          );
          this.props.handleLoading(false);
        }
      });
    });
  };

  onHelmCommand = () => {
    let payload = { deployables: [] };
    let count = 0;
    const totalCharts = this.state.charts.length;

    this.state.charts.forEach((item, key) => {
      this.refs["h" + key].save(list => {
        for (let x = 0; x < list.length; x++) {
          let data = list[x];
          payload.deployables.push(data);
        }
        count++;
        if (count === totalCharts) {
          this.onSaveHelmCommand(payload);
        }
      });
    });
  };

  onClick = () => {
    let payload = { deployables: [] };
    let count = 0;
    const totalCharts = this.state.charts.length;

    this.state.charts.forEach((item, key) => {
      this.refs["h" + key].save(list => {
        for (let x = 0; x < list.length; x++) {
          let data = list[x];
          payload.deployables.push(data);
        }
        count++;
        if (count === totalCharts) {
          this.onSave(payload);
        }
      });
    });
  };

  onCloseCopyModal() {
    this.setState({ onShowCopyModal: false, chartToManipulate: "" });
  }

  async onConfirmCopyModal(item) {
    await this.refs[this.state.chartToManipulate].listVariables(item.value);
    this.setState({ onShowCopyModal: false, chartToManipulate: "" });
  }

  showConfirmCopyModal(ref) {
    this.setState({ onShowCopyModal: true, chartToManipulate: ref });
  }

  closeEditorModal() {
    this.setState({ showEditorModal: false, yaml: "" });
  }

  onSaveHelmCommand = payload => {
    getHelmCommand(payload, this, res => {
      this.setState({ helmValue: res.data, showEditorModal: true });
    });
  };

  render() {
    const envId = this.state.envId;
    const items = this.state.charts.map((item, key) => {
      return (
        <HelmVariables
          handleLoading={this.props.handleLoading}
          canary={false}
          copyVariables={this.showConfirmCopyModal.bind(this)}
          handleNotification={this.props.handleNotification}
          key={key}
          chartName={item}
          chartVersion={this.state.chartVersions[item]}
          desiredTag={this.state.desiredTags[item]}
          xref={"h" + key}
          ref={"h" + key}
          envId={envId}
        />
      );
    });

    return (
      <div className="content">
        <HelmCommandModal
          value={this.state.helmValue}
          show={this.state.showEditorModal}
          close={this.closeEditorModal.bind(this)}
        />

        <CopyModal
          onShow={this.state.onShowCopyModal}
          onClose={this.onCloseCopyModal.bind(this)}
          title="Copy config from another environment"
          subTitle="Select environment"
          onConfirm={this.onConfirmCopyModal.bind(this)}
          environments={this.props.environments}
        ></CopyModal>

        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title=""
                content={
                  <div>
                    <ButtonToolbar>
                      <Button
                        className="btn-primary pull-right"
                        type="button"
                        onClick={this.onClick}
                        disabled={
                          !this.props.keycloak.hasRealmRole(
                            "tenkai-helm-upgrade"
                          )
                        }
                      >
                        Install/Update
                      </Button>

                      <Button
                        className="btn-info pull-right"
                        type="button"
                        onClick={this.onSaveVariablesClick}
                        disabled={
                          !this.props.keycloak.hasRealmRole(
                            "tenkai-variables-save"
                          )
                        }
                      >
                        Save Variables
                      </Button>

                      <Button
                        className="btn-primary pull-right"
                        type="button"
                        onClick={this.onHelmCommand}
                        disabled={
                          !this.props.keycloak.hasRealmRole(
                            "tenkai-helm-upgrade"
                          )
                        }
                      >
                        Show Helm Command
                      </Button>
                    </ButtonToolbar>

                    <div className="clearfix" />
                  </div>
                }
              />
            </Col>
          </Row>

          {items}
        </Grid>
      </div>
    );
  }
}

export default VariablesWizard;
