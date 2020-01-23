import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Table, Card } from 'react-bootstrap';
import * as compareEnvActions from 'stores/compareEnv/actions';
import * as compareEnvSelectors from 'stores/compareEnv/reducer';
import ChartFilter from './ChartFilter';
import FieldFilter from './FieldFilter';
import Environment from './Environment';
import * as global from 'stores/global/actions';

class CompareEnv extends Component {
  componentDidMount() {
    this.props.dispatch(compareEnvActions.loadRepositories());
  }

  selectSourceEnv = selectedSrcEnv => {
    this.props.dispatch(
      compareEnvActions.selectSourceEnvironment(selectedSrcEnv)
    );
    this.props.dispatch(
      compareEnvActions.loadSrcVariables(selectedSrcEnv.value)
    );
  };

  selectTargetEnv = selectedTarEnv => {
    this.props.dispatch(
      compareEnvActions.selectTargetEnvironment(selectedTarEnv)
    );
    this.props.dispatch(
      compareEnvActions.loadTarVariables(selectedTarEnv.value)
    );
  };

  isValid() {
    if (this.props.compareEnv.selectedSrcEnv === undefined) {
      this.props.dispatch(
        global.errorMessage('Please, select the source environment')
      );
      return false;
    }
    if (this.props.compareEnv.selectedTarEnv === undefined) {
      this.props.dispatch(
        global.errorMessage('Please, select the target environment')
      );
      return false;
    }
    if (
      this.props.compareEnv.selectedSrcEnv ===
      this.props.compareEnv.selectedTarEnv
    ) {
      this.props.dispatch(
        global.errorMessage(
          'Source and target environment should be different.'
        )
      );
      return false;
    }
    return true;
  }

  getOnlyCharts() {
    if (this.props.compareEnv.filterOnlyExceptChart === 1) {
      return this.props.compareEnv.selectedCharts;
    }
    return [];
  }

  getExceptCharts() {
    if (this.props.compareEnv.filterOnlyExceptChart === 2) {
      return this.props.compareEnv.selectedCharts;
    }
    return [];
  }

  getOnlyFields() {
    if (this.props.compareEnv.filterOnlyExceptField === 1) {
      return this.props.compareEnv.selectedFields;
    }
    return [];
  }

  getExceptFields() {
    if (this.props.compareEnv.filterOnlyExceptField === 2) {
      return this.props.compareEnv.selectedFields;
    }
    return [];
  }

  handleCompare = () => {
    if (this.isValid()) {
      const payload = {
        sourceEnvId: this.props.compareEnv.selectedSrcEnv.value,
        targetEnvId: this.props.compareEnv.selectedTarEnv.value,
        exceptCharts: this.getExceptCharts(),
        onlyCharts: this.getOnlyCharts(),
        exceptFields: this.getExceptFields(),
        onlyFields: this.getOnlyFields()
      };
      this.props.dispatch(compareEnvActions.compareEnv(payload));
    }
  };

  handleRepositoryChange = repo => {
    this.props.dispatch(compareEnvActions.selectRepository(repo));
    this.props.dispatch(compareEnvActions.loadCharts(repo.value, false));
  };

  sort = (a, b) => {
    const scopeA = a.sourceScope.toUpperCase();
    const scopeB = b.sourceScope.toUpperCase();
    const sourceNameA = a.sourceName.toUpperCase();
    const sourceNameB = b.sourceName.toUpperCase();

    if (scopeA > scopeB || sourceNameA > sourceNameB) {
      return 1;
    }
    if (scopeA < scopeB || sourceNameA < sourceNameB) {
      return -1;
    }
    return 0;
  };

  addChart = selectedChart => {
    this.props.dispatch(compareEnvActions.addChart(selectedChart.value));
  };

  removeChart = selectedChart => {
    this.props.dispatch(compareEnvActions.removeChart(selectedChart));
  };

  addField = selectedField => {
    this.props.dispatch(compareEnvActions.addField(selectedField.value));
  };

  removeField = selectedField => {
    this.props.dispatch(compareEnvActions.removeField(selectedField));
  };

  handleFilterChartChange = filter => {
    this.props.dispatch(compareEnvActions.selectFilterOnlyExcept(filter));
  };

  handleFilterFieldChange = filter => {
    this.props.dispatch(compareEnvActions.selectFilterOnlyExceptField(filter));
  };

  render() {
    console.log(JSON.stringify(this.props.compareEnv, null, 4));

    let srcEnvLabel = '';
    if (!!this.props.compareEnv.selectedSrcEnv) {
      srcEnvLabel = this.props.compareEnv.selectedSrcEnv.label.toUpperCase();
    }
    let tarEnvLabel = '';
    if (!!this.props.compareEnv.selectedTarEnv) {
      tarEnvLabel = this.props.compareEnv.selectedTarEnv.label.toUpperCase();
    }
    let lastScope = '';
    let striped = false;
    let items = [];
    if (!!this.props.compareEnv.envsDiff) {
      items = this.props.compareEnv.envsDiff
        .sort(this.sort)
        .map((item, key) => {
          const scope = item.sourceScope || item.targetScope;
          if (lastScope !== scope) {
            lastScope = scope;
            striped = !striped;
          }
          return (
            <tr key={key} bgcolor={striped ? '#DCDCDC' : '#FFFFFF'}>
              <td>{item.sourceScope}</td>
              <td>{item.sourceName}</td>
              <td>{item.sourceValue}</td>
              <td>{item.targetScope}</td>
              <td>{item.targetName}</td>
              <td>{item.targetValue}</td>
            </tr>
          );
        });
    }
    return (
      <Container fluid>
        <Row>
          <Col md={12}>
            <Environment
              environments={this.props.environments}
              state={this.props.compareEnv}
              selectSourceEnv={this.selectSourceEnv.bind(this)}
              selectTargetEnv={this.selectTargetEnv.bind(this)}
              handleCompare={this.handleCompare.bind(this)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <ChartFilter
              environments={this.props.environments}
              state={this.props.compareEnv}
              handleRepositoryChange={this.handleRepositoryChange}
              addChart={this.addChart.bind(this)}
              handleFilterChartChange={this.handleFilterChartChange}
              removeChart={this.removeChart.bind(this)}
            />
          </Col>
          <Col md={6}>
            <FieldFilter
              state={this.props.compareEnv}
              addField={this.addField.bind(this)}
              handleFilterFieldChange={this.handleFilterFieldChange}
              removeField={this.removeField.bind(this)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header as="h5">
                Diff between source <strong>{srcEnvLabel}</strong> and target{' '}
                <strong>{tarEnvLabel}</strong>
              </Card.Header>
              <Table responsive bordered size="sm">
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>Source Scope</th>
                    <th style={{ width: '13%' }}>Source Variable Name</th>
                    <th style={{ width: '27%' }}>Source Variable Value</th>
                    <th style={{ width: '10%' }}>Target Scope</th>
                    <th style={{ width: '13%' }}>Target Variable Name</th>
                    <th style={{ width: '27%' }}>Target Variable Value</th>
                  </tr>
                </thead>
                <tbody>{items}</tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  compareEnv: compareEnvSelectors.getCompareEnv(state),
  error: compareEnvSelectors.getError(state)
});

export default connect(mapStateToProps)(CompareEnv);
