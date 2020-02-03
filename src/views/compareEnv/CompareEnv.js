import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Row,
  Col,
  Table,
  Card,
  Button,
  Form
} from 'react-bootstrap';
import * as compareEnvActions from 'stores/compareEnv/actions';
import * as compareEnvSelectors from 'stores/compareEnv/reducer';
import ChartFilter from './ChartFilter';
import FieldFilter from './FieldFilter';
import Environment from './Environment';
import * as global from 'stores/global/actions';

class CompareEnv extends Component {
  componentDidMount() {
    this.props.dispatch(compareEnvActions.loadRepositories());
    this.props.dispatch(compareEnvActions.loadCustomFilterFieldTypes());
  }

  selectSourceEnv = async selectedSrcEnv => {
    await this.props.dispatch(
      compareEnvActions.selectSourceEnvironment(selectedSrcEnv)
    );
    await this.props.dispatch(
      compareEnvActions.loadSrcVariables(selectedSrcEnv.value)
    );

    this.autoCompare();
  };

  selectTargetEnv = async selectedTarEnv => {
    await this.props.dispatch(
      compareEnvActions.selectTargetEnvironment(selectedTarEnv)
    );
    await this.props.dispatch(
      compareEnvActions.loadTarVariables(selectedTarEnv.value)
    );

    this.autoCompare();
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

  getCustomFields() {
    if (this.props.compareEnv.filterOnlyExceptField === 3) {
      return this.props.compareEnv.customFields;
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
        onlyFields: this.getOnlyFields(),
        customFields: this.getCustomFields()
      };
      this.props.dispatch(compareEnvActions.compareEnv(payload));
    }
  };

  clearFilter = () => {
    this.props.dispatch(compareEnvActions.clearFilter());
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

  addChart = async selectedChart => {
    await this.props.dispatch(compareEnvActions.addChart(selectedChart.value));
    this.autoCompare();
  };

  removeChart = async selectedChart => {
    await this.props.dispatch(compareEnvActions.removeChart(selectedChart));
    this.autoCompare();
  };

  addField = async selectedField => {
    await this.props.dispatch(compareEnvActions.addField(selectedField.value));
    this.autoCompare();
  };

  selectFilterFieldType = selectedFilterFieldType => {
    this.props.dispatch(
      compareEnvActions.selectFilterFieldType(selectedFilterFieldType)
    );
  };

  addFilterField = async () => {
    const filterType = this.props.compareEnv.selectedFilterFieldType.value;
    const exp = this.props.compareEnv.fieldFilterExp;
    await this.props.dispatch(
      compareEnvActions.addCustomField(filterType, exp)
    );
    this.autoCompare();
  };

  removeField = async selectedField => {
    await this.props.dispatch(compareEnvActions.removeField(selectedField));
    this.autoCompare();
  };

  removeCustomField = async customField => {
    await this.props.dispatch(compareEnvActions.removeCustomField(customField));
    this.autoCompare();
  };

  handleFilterChartChange = async filter => {
    await this.props.dispatch(compareEnvActions.selectFilterOnlyExcept(filter));

    if (this.props.compareEnv.repositories.length === 0) {
      this.props.dispatch(compareEnvActions.loadRepositories());
    }
    if (this.props.compareEnv.selectedCharts.length > 0) {
      this.autoCompare();
    }
  };

  handleFilterFieldChange = async filter => {
    await this.props.dispatch(
      compareEnvActions.selectFilterOnlyExceptField(filter)
    );

    if (this.props.compareEnv.selectedFields.length > 0) {
      this.autoCompare();
    }
  };

  autoCompare() {
    if (
      !!this.props.compareEnv.selectedSrcEnv &&
      !!this.props.compareEnv.selectedTarEnv
    ) {
      this.handleCompare();
    }
  }

  onInputFilter = evt => {
    this.props.dispatch(compareEnvActions.inputFilter(evt.target.value));
  };

  fieldFilterExp = evt => {
    this.props.dispatch(compareEnvActions.fieldFilterExp(evt.target.value));
  };

  match(exp, value) {
    if (value.match(exp) === null) {
      return false;
    }
    return true;
  }

  customFilter(f, inputFilter) {
    try {
      if (inputFilter !== '') {
        return this.match(
          inputFilter,
          f.sourceScope +
            ' ' +
            f.sourceName +
            ' ' +
            f.sourceValue +
            ' ' +
            f.targetScope +
            ' ' +
            f.targetName +
            ' ' +
            f.targetValue
        );
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  copyToLeft = async item => {
    await this.props.dispatch(compareEnvActions.copyToLeft(item));
    this.autoCompare();
  };

  copyToRight = async item => {
    await this.props.dispatch(compareEnvActions.copyToRight(item));
    this.autoCompare();
  };

  renderCopyToLeft = item => {
    if (item.targetName === '' && item.sourceName !== '') {
      return false;
    }
    return true;
  };

  renderCopyToRight = item => {
    if (item.sourceName === '' && item.targetName !== '') {
      return false;
    }
    return true;
  };

  render() {
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
    const inputFilter = this.props.compareEnv.inputFilter;
    if (
      !!this.props.compareEnv.envsDiff &&
      Array.isArray(this.props.compareEnv.envsDiff)
    ) {
      items = this.props.compareEnv.envsDiff
        .filter(f => this.customFilter(f, inputFilter))
        .sort(this.sort)
        .map((item, key) => {
          const scope = item.sourceScope || item.targetScope;
          if (lastScope !== scope) {
            lastScope = scope;
            striped = !striped;
          }
          return (
            <tr key={key} bgcolor={striped ? '#EAECEE' : '#FFFFFF'}>
              <td>{item.sourceScope}</td>
              <td>{item.sourceName}</td>
              <td>
                <Row>
                  <Col md={11}>{item.sourceValue}</Col>
                  <Col md={1}>
                    {this.renderCopyToRight(item) ? (
                      <Button
                        className="link-button"
                        onClick={this.copyToRight.bind(this, item)}
                      >
                        <i className="pe-7s-right-arrow" />
                      </Button>
                    ) : null}
                  </Col>
                </Row>
              </td>
              <td>{item.targetScope}</td>
              <td>{item.targetName}</td>
              <td>
                <Row>
                  <Col md={1}>
                    {this.renderCopyToLeft(item) ? (
                      <Button
                        className="link-button"
                        onClick={this.copyToLeft.bind(this, item)}
                      >
                        <i className="pe-7s-left-arrow" />
                      </Button>
                    ) : null}
                  </Col>
                  <Col md={11}>{item.targetValue}</Col>
                </Row>
              </td>
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
              removeCustomField={this.removeCustomField.bind(this)}
              selectFilterFieldType={this.selectFilterFieldType.bind(this)}
              addFilterField={this.addFilterField}
              fieldFilterExp={this.fieldFilterExp}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Global Filter</Form.Label>
              <Form.Control
                type="text"
                onChange={this.onInputFilter.bind(this)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Button variant="primary" onClick={this.handleCompare}>
              Compare
            </Button>
            <Button variant="danger" onClick={this.clearFilter}>
              Clear Filter
            </Button>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Card>
              <Card.Header as="h5">
                Diff between source <strong>{srcEnvLabel}</strong> and target{' '}
                <strong>{tarEnvLabel}</strong>
              </Card.Header>
              <Table id="compareEnv" bordered responsive size="sm">
                <thead>
                  <th style={{ width: '10%' }}>Source Scope</th>
                  <th style={{ width: '13%' }}>Source Variable Name</th>
                  <th style={{ width: '27%' }}>Source Variable Value</th>
                  <th style={{ width: '10%' }}>Target Scope</th>
                  <th style={{ width: '13%' }}>Target Variable Name</th>
                  <th style={{ width: '27%' }}>Target Variable Value</th>
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
