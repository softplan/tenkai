import React, { Component } from "react";
import {
  Grid,
  Row,
  Col, ButtonToolbar
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import HelmVariables from "components/Deployment/HelmVariables.jsx";
import CopyModal from "components/Modal/CopyModal.jsx";
import { multipleInstall } from "client-api/apicall.jsx"

class VariablesWizard extends Component {

  state = {
    envId: "",
    charts: [],
    chartVersions: new Map(),
    onShowCopyModal: false,
  }

  componentDidMount() {
    let total = this.props.selectedChartsToDeploy.length;
    let chartsToDeploy = this.props.selectedChartsToDeploy;
    let helmCharts = [];
    let chartVersion = "";
    let value = "";
    let chartVersions = new Map();
    for (let i = 0; i < total; i++) {
      value = chartsToDeploy[i].substring(0, chartsToDeploy[i].indexOf("@"))
      helmCharts.push(value);
      chartVersion = chartsToDeploy[i].substring(chartsToDeploy[i].indexOf("@") + 1, chartsToDeploy[i].length)
      chartVersions[value] = chartVersion;
    }
    this.setState({ charts: helmCharts, chartVersions: chartVersions }, async () => {
      this.props.handleLoading(true);
      await this.getChildVariables();
      this.props.handleLoading(false);
    });

  }

  async getChildVariables() {
    for (let x = 0; x < this.state.charts.length; x++) {
      let chartName = this.state.charts[x];
      await this.refs["h" + x].getVariables(chartName, this.state.chartVersions[chartName]);
    }
  }

  constructor(props) {
    super(props);
    this.state.envId = this.props.selectedEnvironment.value;
  }

  onSave = (payload) => {
    multipleInstall(payload, this);
  }

  onSaveVariablesClick = () => {
    this.props.handleLoading(true);
    this.state.charts.forEach((item, key) => {
      this.refs["h" + key].save((data) => { });
    });
    this.props.handleLoading(false);
  }

  onClick = () => {

    let payload = { deployables: [] };
    let count = 0;
    const totalCharts = this.state.charts.length;

    this.state.charts.forEach((item, key) => {
      this.refs["h" + key].save((list) => {
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
  }


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

  render() {

    const envId = this.state.envId;
    const items = this.state.charts.map((item, key) => {
      return (
        <HelmVariables handleLoading={this.props.handleLoading}
          copyVariables={this.showConfirmCopyModal.bind(this)}
          handleNotification={this.props.handleNotification}
          key={key} chartName={item} chartVersion={this.state.chartVersions[item]}
          xref={"h" + key}
          ref={"h" + key}
          envId={envId} />
      )

    });

    return (
      <div className="content">

        <CopyModal
              onShow={this.state.onShowCopyModal}
              onClose={this.onCloseCopyModal.bind(this)}
              title="Copy config from another environment" subTitle="Select environment" 
              onConfirm={this.onConfirmCopyModal.bind(this)}
              environments={this.props.environments}>
        </CopyModal>


        <Grid fluid>

          <Row>

            <Col md={12}>
              <Card
                title=""
                content={
                  <div>
                    <ButtonToolbar>

                      <Button className="btn-primary pull-right"
                        type="button"
                        onClick={this.onClick}
                        disabled={!this.props.keycloak.hasRealmRole("tenkai-helm-upgrade")}
                      >Install/Update</Button>

                      <Button className="btn-info pull-right"
                        type="button"
                        onClick={this.onSaveVariablesClick}
                        disabled={!this.props.keycloak.hasRealmRole("tenkai-variables-save")}
                      >Save Variables</Button>

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
