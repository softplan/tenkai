import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import TenkaiTable from 'components/Table/TenkaiTable';
import * as col from 'components/Table/TenkaiColumn';

import * as actions from 'stores/compareEnv/actions';
import * as compareEnvSelectors from 'stores/compareEnv/reducer';
import ChartFilter from './ChartFilter';
import FieldFilter from './FieldFilter';
import Environment from './Environment';
import * as global from 'stores/global/actions';
import ModalSaveAs from './ModalSaveAs';
import SimpleModal from 'components/Modal/SimpleModal.jsx';

class CompareEnv extends Component {
  componentDidMount() {
    this.props.dispatch(actions.loadRepositories());
    this.props.dispatch(actions.loadCustomFilterFieldTypes());
    this.props.dispatch(actions.loadCompareEnvQueries());
    this.props.dispatch(actions.setEnvironments(this.props.environments));
  }

  selectSourceEnv = async selectedSrcEnv => {
    await this.props.dispatch(actions.selectSourceEnvironment(selectedSrcEnv));
    await this.props.dispatch(actions.loadSrcVariables(selectedSrcEnv.value));

    this.autoCompare();
  };

  selectTargetEnv = async selectedTarEnv => {
    await this.props.dispatch(actions.selectTargetEnvironment(selectedTarEnv));
    await this.props.dispatch(actions.loadTarVariables(selectedTarEnv.value));

    this.autoCompare();
  };

  selectCompareEnvQuery = async selectedQuery => {
    await this.props.dispatch(actions.renderCompareEnvQuery(selectedQuery));
    await this.props.dispatch(
      actions.loadSrcVariables(selectedQuery.value.query.sourceEnvId)
    );
    await this.props.dispatch(
      actions.loadTarVariables(selectedQuery.value.query.targetEnvId)
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
      this.props.dispatch(actions.compareEnv(payload));
    }
  };

  clearFilter = () => {
    this.props.dispatch(actions.clearFilter());
  };

  saveAsFilter = async () => {
    this.props.dispatch(actions.showSaveAsDialog());
    await this.props.dispatch(actions.loadCompareEnvQueries());
  };

  saveFilter = async () => {
    this.props.dispatch(actions.showSaveDialog());
  };

  deleteQuery = () => {
    this.props.dispatch(actions.showDeleteDialog());
  };

  deleteQueryConfirm = async () => {
    await this.props.dispatch(
      actions.deleteQuery(
        this.props.compareEnv.selectedCompareEnvQuery.value.id
      )
    );
    await this.props.dispatch(actions.loadCompareEnvQueries());
  };

  deleteQueryCancel = () => {
    this.props.dispatch(actions.deleteQueryCancel());
  };

  handleSaveAsCancel = () => {
    this.props.dispatch(actions.cancelSaveAs());
  };

  handleSaveCancel = () => {
    this.props.dispatch(actions.cancelSave());
  };

  handleSaveAsName = evt => {
    this.props.dispatch(actions.inputSaveName(evt.target.value));
  };

  handleSaveAsConfirm = async () => {
    if (this.isValid()) {
      const payload = {
        name: this.props.compareEnv.compareEnvQueryName,
        userEmail: this.props.keycloak.userInfo.email,
        data: {
          sourceEnvId: this.props.compareEnv.selectedSrcEnv.value,
          targetEnvId: this.props.compareEnv.selectedTarEnv.value,
          exceptCharts: this.getExceptCharts(),
          onlyCharts: this.getOnlyCharts(),
          exceptFields: this.getExceptFields(),
          onlyFields: this.getOnlyFields(),
          customFields: this.getCustomFields(),
          filterOnlyExceptChart: this.props.compareEnv.filterOnlyExceptChart,
          filterOnlyExceptField: this.props.compareEnv.filterOnlyExceptField,
          selectedFilterFieldType: this.props.compareEnv
            .selectedFilterFieldType,
          globalFilter: this.props.compareEnv.inputFilter
        }
      };
      await this.props.dispatch(actions.handleSaveConfirm(payload));
      await this.props.dispatch(actions.loadCompareEnvQueries());
    }
  };

  handleSaveConfirm = async () => {
    if (this.isValid()) {
      const payload = {
        id: this.props.compareEnv.selectedCompareEnvQuery.value.id,
        name: this.props.compareEnv.selectedCompareEnvQuery.value.name,
        userEmail: this.props.keycloak.userInfo.email,
        data: {
          sourceEnvId: this.props.compareEnv.selectedSrcEnv.value,
          targetEnvId: this.props.compareEnv.selectedTarEnv.value,
          exceptCharts: this.getExceptCharts(),
          onlyCharts: this.getOnlyCharts(),
          exceptFields: this.getExceptFields(),
          onlyFields: this.getOnlyFields(),
          customFields: this.getCustomFields(),
          filterOnlyExceptChart: this.props.compareEnv.filterOnlyExceptChart,
          filterOnlyExceptField: this.props.compareEnv.filterOnlyExceptField,
          selectedFilterFieldType: this.props.compareEnv
            .selectedFilterFieldType,
          globalFilter: this.props.compareEnv.inputFilter
        }
      };
      await this.props.dispatch(actions.handleSaveConfirm(payload));
      await this.props.dispatch(actions.loadCompareEnvQueries());
      await this.props.dispatch(actions.updateSelectedCompareEnvQuery());
    }
  };

  handleRepositoryChange = repo => {
    this.props.dispatch(actions.selectRepository(repo));
    this.props.dispatch(actions.loadCharts(repo.value, false));
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
    await this.props.dispatch(actions.addChart(selectedChart.value));
    this.autoCompare();
  };

  removeChart = async selectedChart => {
    await this.props.dispatch(actions.removeChart(selectedChart));
    this.autoCompare();
  };

  addField = async selectedField => {
    await this.props.dispatch(actions.addField(selectedField.value));
    this.autoCompare();
  };

  selectFilterFieldType = selectedFilterFieldType => {
    this.props.dispatch(actions.selectFilterFieldType(selectedFilterFieldType));
  };

  addFilterField = async () => {
    const filterType = this.props.compareEnv.selectedFilterFieldType.value;
    const exp = this.props.compareEnv.fieldFilterExp;
    await this.props.dispatch(actions.addCustomField(filterType, exp));
    this.autoCompare();
  };

  removeField = async selectedField => {
    await this.props.dispatch(actions.removeField(selectedField));
    this.autoCompare();
  };

  removeCustomField = async customField => {
    await this.props.dispatch(actions.removeCustomField(customField));
    this.autoCompare();
  };

  handleFilterChartChange = async filter => {
    await this.props.dispatch(actions.selectFilterOnlyExcept(filter));

    if (this.props.compareEnv.repositories.length === 0) {
      this.props.dispatch(actions.loadRepositories());
    }
    if (this.props.compareEnv.selectedCharts.length > 0) {
      this.autoCompare();
    }
  };

  handleFilterFieldChange = async filter => {
    await this.props.dispatch(actions.selectFilterOnlyExceptField(filter));

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
    this.props.dispatch(actions.inputFilter(evt.target.value));
  };

  fieldFilterExp = evt => {
    this.props.dispatch(actions.fieldFilterExp(evt.target.value));
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
    await this.props.dispatch(actions.copyToLeft(item));
    this.autoCompare();
  };

  copyToRight = async item => {
    await this.props.dispatch(actions.copyToRight(item));
    this.autoCompare();
  };

  renderCopyToLeft = item => {
    if (item.targetName === '' && item.sourceName !== '') {
      return false;
    }
    return true;
  };

  renderDeleteRight = item => {
    if (item.targetName !== '' && item.sourceName === '') {
      return true;
    }
    return false;
  };

  renderCopyToRight = item => {
    if (item.sourceName === '' && item.targetName !== '') {
      return false;
    }
    return true;
  };

  renderDeleteLeft = item => {
    if (item.sourceName !== '' && item.targetName === '') {
      return true;
    }
    return false;
  };

  deleteLeft = item => {
    this.props.dispatch(actions.showDeleteLeftVarDialog(item.sourceVarId));
  };

  deleteRight = item => {
    this.props.dispatch(actions.showDeleteRightVarDialog(item.targetVarId));
  };

  deleteLeftConfirm = async () => {
    await this.props.dispatch(
      actions.deleteLeftVar(this.props.compareEnv.variableToDelete.ID)
    );
    this.autoCompare();
  };

  deleteLeftCancel = item => {
    this.props.dispatch(actions.hideDeleteLeftVarDialog());
  };

  deleteRightConfirm = async () => {
    await this.props.dispatch(
      actions.deleteRightVar(this.props.compareEnv.variableToDelete.ID)
    );
    this.autoCompare();
  };

  deleteRightCancel = item => {
    this.props.dispatch(actions.hideDeleteRightVarDialog());
  };

  scopeStriped(data, striped) {
    return (row, rowIndex) => {
      if (rowIndex === 0) {
        striped = false;
      } else {
        const last = rowIndex - 1;
        const lastScope = data[last].sourceScope || data[last].targetScope;
        const currentScope = row.sourceScope || row.targetScope;

        if (lastScope !== currentScope) {
          striped = !striped;
        }
      }
      return striped ? 'bg-silver' : '';
    };
  }

  btnSrcValue = (cell, row) => {
    return (
      <Row>
        <Col md={11}>{row.sourceValue}</Col>
        <Col md={1}>
          {this.renderCopyToRight(row) ? (
            <Button
              className="link-button"
              onClick={this.copyToRight.bind(this, row)}
            >
              <i className="pe-7s-right-arrow" />
            </Button>
          ) : null}
          {this.renderDeleteLeft(row) ? (
            <Button
              className="link-button"
              onClick={this.deleteLeft.bind(this, row)}
            >
              <i className="pe-7s-trash" />
            </Button>
          ) : null}
        </Col>
      </Row>
    );
  };

  btnTarValue = (cell, row) => {
    return (
      <Row>
        <Col md={1}>
          {this.renderCopyToLeft(row) ? (
            <Button
              className="link-button"
              onClick={this.copyToLeft.bind(this, row)}
            >
              <i className="pe-7s-left-arrow" />
            </Button>
          ) : null}
          {this.renderDeleteRight(row) ? (
            <Button
              className="link-button"
              onClick={this.deleteRight.bind(this, row)}
            >
              <i className="pe-7s-trash" />
            </Button>
          ) : null}
        </Col>
        <Col md={11}>{row.targetValue}</Col>
      </Row>
    );
  };

  showSaveDialog() {
    let showSaveDialog = false;
    if (!!this.props.compareEnv.showSaveDialog) {
      showSaveDialog = this.props.compareEnv.showSaveDialog;
    }
    return showSaveDialog;
  }

  showSaveAsDialog() {
    let showSaveAsDialog = false;
    if (!!this.props.compareEnv.showSaveAsDialog) {
      showSaveAsDialog = this.props.compareEnv.showSaveAsDialog;
    }
    return showSaveAsDialog;
  }

  getTarEnvLabel() {
    let tarEnvLabel = '';
    if (!!this.props.compareEnv.selectedTarEnv) {
      tarEnvLabel = this.props.compareEnv.selectedTarEnv.label.toUpperCase();
    }
    return tarEnvLabel;
  }

  getSrcEnvLabel() {
    let srcEnvLabel = '';
    if (!!this.props.compareEnv.selectedSrcEnv) {
      srcEnvLabel = this.props.compareEnv.selectedSrcEnv.label.toUpperCase();
    }
    return srcEnvLabel;
  }

  render() {
    let columns = [];
    columns.push(col.addCol('sourceScope', 'Source Scope', '10%'));
    columns.push(col.addCol('sourceName', 'Source Variable Name', '13%'));
    columns.push(
      col.addColBtn(
        'sourceValue',
        'Source Variable Value',
        this.btnSrcValue,
        '27%'
      )
    );
    columns.push(col.addCol('targetScope', 'Target Scope', '10%'));
    columns.push(col.addCol('targetName', 'Target Variable Name', '13%'));
    columns.push(
      col.addColBtn(
        'targetValue',
        'Target Variable Value',
        this.btnTarValue,
        '27%'
      )
    );

    let srcEnvLabel = this.getSrcEnvLabel();
    let tarEnvLabel = this.getTarEnvLabel();
    let showSaveAsDialog = this.showSaveAsDialog();
    let showSaveDialog = this.showSaveDialog();

    let data = [];
    if (
      !!this.props.compareEnv.envsDiff &&
      Array.isArray(this.props.compareEnv.envsDiff)
    ) {
      data = this.props.compareEnv.envsDiff
        .filter(f => this.customFilter(f, this.props.compareEnv.inputFilter))
        .sort(this.sort);
    }
    let striped = false;
    return (
      <Container fluid>
        <ModalSaveAs
          showModal={showSaveAsDialog}
          handleCancel={this.handleSaveAsCancel}
          handleSaveName={this.handleSaveAsName.bind(this)}
          handleSaveConfirm={this.handleSaveAsConfirm}
        />
        <SimpleModal
          showConfirmDeleteModal={showSaveDialog}
          handleConfirmDeleteModalClose={this.handleSaveCancel}
          title="Overwrite current environment comparison query?"
          subTitle=""
          message={`It will save the current environment comparison query with the name: ${this.props.compareEnv.selectedCompareEnvQuery.label}`}
          handleConfirmDelete={this.handleSaveConfirm}
        ></SimpleModal>
        <SimpleModal
          showConfirmDeleteModal={this.props.compareEnv.showDeleteDialog}
          handleConfirmDeleteModalClose={this.deleteQueryCancel}
          title="Delete environment comparison query?"
          subTitle=""
          message={`The following environment comparison query will be deleted: ${this.props.compareEnv.selectedCompareEnvQuery.label}`}
          handleConfirmDelete={this.deleteQueryConfirm}
        ></SimpleModal>
        <SimpleModal
          showConfirmDeleteModal={this.props.compareEnv.showDeleteLeftDialog}
          handleConfirmDeleteModalClose={this.deleteLeftCancel}
          title="Delete variable?"
          subTitle=""
          message={`The following variable will be deleted: ${this.props.compareEnv.variableToDelete.name}`}
          handleConfirmDelete={this.deleteLeftConfirm}
        ></SimpleModal>
        <SimpleModal
          showConfirmDeleteModal={this.props.compareEnv.showDeleteRightDialog}
          handleConfirmDeleteModalClose={this.deleteRightCancel}
          title="Delete variable?"
          subTitle=""
          message={`The following variable will be deleted: ${this.props.compareEnv.variableToDelete.name}`}
          handleConfirmDelete={this.deleteRightConfirm}
        ></SimpleModal>
        <Row>
          <Col md={12}>
            <Environment
              state={this.props.compareEnv}
              selectSourceEnv={this.selectSourceEnv.bind(this)}
              selectTargetEnv={this.selectTargetEnv.bind(this)}
              selectCompareEnvQuery={this.selectCompareEnvQuery.bind(this)}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <ChartFilter
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
          <Col md={12}>
            <Form.Group>
              <Form.Label>Global Filter</Form.Label>
              <Form.Control
                type="text"
                onChange={this.onInputFilter.bind(this)}
                value={this.props.compareEnv.inputFilter}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Button variant="primary" onClick={this.handleCompare}>
              Compare
            </Button>
            <Button variant="secondary" onClick={this.clearFilter}>
              Clear Filter
            </Button>
          </Col>
          <Col md={6}>
            <Button variant="primary" onClick={this.saveAsFilter}>
              Save query as...
            </Button>
            <Button variant="secondary" onClick={this.saveFilter}>
              Save
            </Button>
            <Button variant="danger" onClick={this.deleteQuery}>
              Delete query
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
              <div className="scroll-table">
                <TenkaiTable
                  id="compareEnv"
                  columns={columns}
                  data={data}
                  rowClasses={this.scopeStriped(data, striped)}
                  striped={false}
                />
              </div>
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
