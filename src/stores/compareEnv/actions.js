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
