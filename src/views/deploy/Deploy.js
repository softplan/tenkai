import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';

import { CardTenkai } from 'components/Card/CardTenkai.jsx';
import { getHelmCommand } from 'client-api/apicall.jsx';
import TenkaiTable from 'components/Table/TenkaiTable';
import HelmCommandModal from 'components/Modal/HelmCommandModal';

import * as col from 'components/Table/TenkaiColumn';
import * as actions from 'stores/deploy/actions';
import * as selectors from 'stores/deploy/reducer';
import Select from 'react-select';
import { Card, Button, FormGroup, FormLabel } from 'react-bootstrap';

const columns = checkboxElem => [
  col.addColCheckbox('checkbox', '', checkboxElem),
  col.addCol('chartName', 'Chart Name'),
  col.addCol('chartVersion', 'Chart Version'),
  col.addCol('dockerTag', 'Docker Tag')
];
export class Deploy extends Component {
  state = {
    selectedEnvironments: this.getEnvs(),
    showHelmCmdModal: false,
    helmValue: '',
    selectedCharts: []
  };

  componentDidMount() {
    const { deploy } = this.props;

    if (deploy && deploy.chartsToDeploy.length === 1) {
      this.setState({ selectedCharts: deploy.chartsToDeploy });
    }
  }

  closeHelmCmdModal() {
    this.setState({ showHelmCmdModal: false, helmValue: '' });
  }

  isMultiEnvDeployment() {
    return this.props.deploy.deployType === 'MULTI_ENV';
  }

  getEnvs() {
    if (this.isMultiEnvDeployment()) {
      return this.props.deploy.selectedEnvironments;
    }
    return [];
  }

  onDeploy() {
    let payload = this.createDeployPayload();
    this.props.dispatch(actions.deploy(payload));
  }

  getEnvironmentIds() {
    if (this.isMultiEnvDeployment()) {
      return this.props.deploy.selectedEnvironments.map(e => e.value);
    } else {
      return this.state.selectedEnvironments.map(e => e.value);
    }
  }

  createDeployPayload() {
    return {
      productVersionId: this.props.deploy.productVersionId,
      environmentIds: this.getEnvironmentIds(),
      deployables: this.state.selectedCharts.map(c => ({
        environmentId: this.state.selectedEnvironments[0].value,
        chart: c.chartName,
        chartVersion: c.chartVersion,
        name: this.getChartName(c.chartName)
      }))
    };
  }

  getChartName(name) {
    let splited = name.split('/');
    if (splited.length > 0) {
      return splited[1];
    }
    return name;
  }

  handleEnvironmentChange = selectedEnvironments => {
    this.setState({ selectedEnvironments });
  };

  hasEnvironmentSelected() {
    return (
      this.state.selectedEnvironments && this.state.selectedEnvironments.length
    );
  }

  hasChartSelected() {
    return this.state.selectedCharts.length;
  }

  onShowHelmCommand() {
    getHelmCommand(this.createDeployPayload(), this, ({ data }) => {
      this.setState({ helmValue: data, showHelmCmdModal: true });
    });
  }

  selectAllCharts(data) {
    const allChartsSelected = data.length === this.state.selectedCharts.length;

    this.setState({
      selectedCharts: allChartsSelected ? [] : data
    });
  }

  handleSelectChart(value) {
    const selected = this.state.selectedCharts;
    const selectedIndex = selected.indexOf(value);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, value);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selectedCharts: newSelected });
  }

  renderCheckbox(_, row) {
    return (
      <input
        type="checkbox"
        onChange={() => this.handleSelectChart(row)}
        checked={this.state.selectedCharts.indexOf(row) > -1}
      />
    );
  }

  renderTableContent() {
    const { deploy } = this.props;
    const data = (deploy && deploy.chartsToDeploy) || [];
    const allChartsSelected = data.length === this.state.selectedCharts.length;

    return (
      <>
        <Button
          onClick={this.selectAllCharts.bind(this, data)}
          variant="secondary"
        >
          {allChartsSelected ? 'Deselect All' : 'Select All'}
        </Button>
        <TenkaiTable
          key={Math.random()}
          keyfield="chartName"
          columns={columns(this.renderCheckbox.bind(this))}
          data={data}
        />
      </>
    );
  }

  render() {
    const shouldDisabledBtn = !(
      this.hasEnvironmentSelected() && this.hasChartSelected()
    );

    return (
      <div className="content">
        <Container fluid>
          <Row>
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <FormLabel>Environments</FormLabel>
                        <Select
                          value={this.state.selectedEnvironments}
                          onChange={this.handleEnvironmentChange}
                          options={this.props.environments}
                          className="react-select-zindex-4"
                          isMulti
                          closeMenuOnSelect={false}
                          isDisabled={this.isMultiEnvDeployment()}
                        />
                      </FormGroup>
                    </Col>
                    <Col></Col>
                  </Row>
                  <div className="d-flex justify-content-end">
                    <Button
                      variant="secondary"
                      onClick={this.onShowHelmCommand.bind(this)}
                      disabled={shouldDisabledBtn}
                    >
                      Show Helm Command
                    </Button>
                    <Button
                      variant="primary"
                      onClick={this.onDeploy.bind(this)}
                      disabled={shouldDisabledBtn}
                    >
                      Request Install
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <CardTenkai
                title="Charts to Deploy"
                content={this.renderTableContent()}
              />
            </Col>
          </Row>
        </Container>
        <HelmCommandModal
          value={this.state.helmValue}
          show={this.state.showHelmCmdModal}
          close={this.closeHelmCmdModal.bind(this)}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  deploy: selectors.getDeploy(state)
});

export default connect(mapStateToProps)(Deploy);
