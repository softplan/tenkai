import * as types from './actionTypes';
import * as services from 'services/compareEnv';
import * as global from 'stores/global/actions';

export function selectSourceEnvironment(selectedSrcEnv) {
  return async dispatch => {
    dispatch(types.selectSourceEnvironment(selectedSrcEnv));
  };
}

export function selectTargetEnvironment(selectedTarEnv) {
  return async dispatch => {
    dispatch(types.selectTargetEnvironment(selectedTarEnv));
  };
}

export function selectRepository(selectedRepository) {
  return async dispatch => {
    dispatch(types.selectRepository(selectedRepository));
  };
}

export function addChart(selectedChart) {
  return async dispatch => {
    dispatch(types.addChart(selectedChart));
  };
}

export function removeChart(selectedChart) {
  return async dispatch => {
    dispatch(types.removeChart(selectedChart));
  };
}

export function addField(selectedField) {
  return async dispatch => {
    dispatch(types.addField(selectedField));
  };
}

export function removeField(selectedField) {
  return async dispatch => {
    dispatch(types.removeField(selectedField));
  };
}

export function addCustomField(filterType, exp) {
  return async dispatch => {
    dispatch(types.addCustomField(filterType, exp));
  };
}

export function removeCustomField(customField) {
  return async dispatch => {
    dispatch(types.removeCustomField(customField));
  };
}

export function selectFilterFieldType(selectedFilterFieldType) {
  return async dispatch => {
    dispatch(types.selectFilterFieldType(selectedFilterFieldType));
  };
}

export function selectFilterOnlyExcept(filterOnlyExceptChart) {
  return async dispatch => {
    dispatch(types.selectFilterOnlyExcept(filterOnlyExceptChart));
  };
}

export function selectFilterOnlyExceptField(filterOnlyExceptField) {
  return async dispatch => {
    dispatch(types.selectFilterOnlyExceptField(filterOnlyExceptField));
  };
}

export function inputFilter(value) {
  return async dispatch => {
    dispatch(types.inputFilter(value));
  };
}

export function fieldFilterExp(value) {
  return async dispatch => {
    dispatch(types.fieldFilterExp(value));
  };
}

export function compareEnv(data) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      const result = await services.compareEnvs(data);
      const envsDiff = result.data.list;

      dispatch(global.successWithParam(types.compareEnvSuccess, envsDiff));
    } catch (error) {
      dispatch(global.handleError(error, types.compareEnvError));
    }
  };
}

export function clearFilter() {
  return async dispatch => {
    dispatch(types.clearFilter());
  };
}

export function showSaveAsDialog() {
  return async dispatch => {
    dispatch(types.showSaveAsDialog());
  };
}

export function cancelSaveAs() {
  return async dispatch => {
    dispatch(types.cancelSaveAs());
  };
}

export function showSaveDialog() {
  return async dispatch => {
    dispatch(types.showSaveDialog());
  };
}

export function showDeleteDialog() {
  return async dispatch => {
    dispatch(types.showDeleteDialog());
  };
}

export function cancelSave() {
  return async dispatch => {
    dispatch(types.cancelSave());
  };
}

export function inputSaveName(value) {
  return async dispatch => {
    dispatch(types.inputSaveName(value));
  };
}

export function handleSaveConfirm(data) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.saveCompareEnvQuery(data);

      dispatch(global.handleSuccess(types.saveCompareEnvQuerySuccess));
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.saveCompareEnvQueryError));
    }
  };
}

export function deleteQuery(id) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.deleteQuery(id);

      dispatch(global.handleSuccess(types.deleteQuerySuccess));
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.deleteQueryError));
    }
  };
}

export function deleteQueryCancel() {
  return async dispatch => {
    dispatch(types.deleteQueryCancel());
  };
}

export function loadRepositories() {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      const result = await services.loadRepositories();
      const repositories = result.data.repositories;
      const r = repositories.map(e => {
        const x = {
          value: e.name,
          label: e.name
        };
        return x;
      });

      dispatch(global.successWithParam(types.loadReposSuccess, r));
    } catch (error) {
      dispatch(global.handleError(error, types.loadReposError));
    }
  };
}

export function loadCompareEnvQueries() {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      const result = await services.loadCompareEnvQueries();
      const data = result.data;
      const r = data.map(e => {
        const x = {
          label: e.name,
          value: {
            id: e.ID,
            userId: e.userId,
            name: e.name,
            query: e.query
          }
        };
        return x;
      });

      dispatch(global.successWithParam(types.loadCompareEnvQueriesSuccess, r));
    } catch (error) {
      dispatch(global.handleError(error, types.loadCompareEnvQueriesError));
    }
  };
}

export function setEnvironments(environments) {
  return async dispatch => {
    dispatch(global.successWithParam(types.setEnvironments, environments));
  };
}

export function loadCharts(repo) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      const result = await services.loadCharts(repo);
      const charts = result.data.charts;
      let repos = [];

      if (!!result && !!result.data && !!result.data.charts) {
        repos = charts.map(e => {
          const item = {
            value: e.name,
            label: e.name
          };
          return item;
        });
      }

      repos.push({ value: 'global', label: 'global' });
      dispatch(global.successWithParam(types.loadChartsSuccess, repos));
    } catch (e) {
      dispatch(global.handleError(e, types.loadChartsError));
    }
  };
}

export function loadSrcVariables(envId) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      const result = await services.loadVariables(envId);
      const vars = result.data.Variables;

      dispatch(global.successWithParam(types.loadSrcVariablesSuccess, vars));
      dispatch(updateFields(vars));
    } catch (e) {
      dispatch(global.handleError(e, types.loadSrcVariablesError));
    }
  };
}

export function loadTarVariables(envId) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      const result = await services.loadVariables(envId);
      const vars = result.data.Variables;

      dispatch(global.successWithParam(types.loadTarVariablesSuccess, vars));
      dispatch(updateFields(vars));
    } catch (e) {
      dispatch(global.handleError(e, types.loadTarVariablesError));
    }
  };
}

export function renderCompareEnvQuery(selectedQuery) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());
      dispatch(
        global.successWithParam(types.renderCompareEnvQuery, selectedQuery)
      );
    } catch (e) {
      dispatch(global.handleError(e, types.renderCompareEnvQueryError));
    }
  };
}

export function updateSelectedCompareEnvQuery() {
  return async dispatch => {
    dispatch(global.successWithParam(types.updateSelectedCompareEnvQuery));
  };
}

export function updateFields(vars) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      let fields = vars.map((i, key) => {
        const item = {
          value: i.name,
          label: i.name
        };
        return item;
      });

      dispatch(global.successWithParam(types.updateFields, fields));
    } catch (e) {
      dispatch(global.handleError(e, types.loadSrcVariablesError));
    }
  };
}

export function loadCustomFilterFieldTypes() {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());
      const filterFields = await services.loadCustomFilterField();
      dispatch(
        global.successWithParam(types.loadCustomFilterField, filterFields)
      );
    } catch (e) {
      dispatch(global.handleError(e, types.loadCustomFilterFieldError));
    }
  };
}

export function copyToLeft(item) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());
      await services.copyVariableValue({
        srcVarId: toInt(item.targetVarId),
        tarEnvId: toInt(item.sourceEnvId),
        tarVarId: toInt(item.sourceVarId),
        newValue: item.targetValue
      });
      dispatch(global.handleSuccess(types.copyToLeftSuccess));
    } catch (e) {
      dispatch(global.handleError(e, types.copyToLeftError));
    }
  };
}

export function copyToRight(item) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());
      await services.copyVariableValue({
        srcVarId: toInt(item.sourceVarId),
        tarEnvId: toInt(item.targetEnvId),
        tarVarId: toInt(item.targetVarId),
        newValue: item.sourceValue
      });
      dispatch(global.handleSuccess(types.copyToRightSuccess));
    } catch (e) {
      dispatch(global.handleError(e, types.copyToRightError));
    }
  };
}

export function showDeleteLeftVarDialog(varId) {
  return async dispatch => {
    dispatch(types.showDeleteLeftVarDialog(varId));
  };
}

export function deleteLeftVar(id) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.deleteVariable(id);

      dispatch(global.successWithParam(types.deleteLeftVarSuccess, id));
      dispatch(hideDeleteLeftVarDialog());
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.deleteLeftVarError));
    }
  };
}

export function showDeleteRightVarDialog(varId) {
  return async dispatch => {
    dispatch(types.showDeleteRightVarDialog(varId));
  };
}

export function deleteRightVar(id) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.deleteVariable(id);

      dispatch(global.successWithParam(types.deleteRightVarSuccess, id));
      dispatch(hideDeleteRightVarDialog());
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.deleteRightVarError));
    }
  };
}

export function hideDeleteLeftVarDialog() {
  return async dispatch => {
    dispatch(types.hideDeleteLeftVarDialog());
  };
}

export function hideDeleteRightVarDialog() {
  return async dispatch => {
    dispatch(types.hideDeleteRightVarDialog());
  };
}

function toInt(v) {
  let x = parseInt(v);
  if (isNaN(x)) {
    return 0;
  }
  return x;
}
