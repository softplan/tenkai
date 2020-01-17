import * as types from './actionTypes';
import * as services from 'services/compareEnv';

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

export function compareEnv(data) {
  return async dispatch => {
    try {
      dispatch(types.compareEnvBegin());

      const result = await services.compareEnvs(data);
      const envsDiff = result.data.list;

      dispatch(types.compareEnvSuccess(envsDiff));
    } catch (error) {
      dispatch(types.compareEnvError(error));
    }
  };
}

export function loadRepositories() {
  return async dispatch => {
    try {
      dispatch(types.loadReposBegin());

      const result = await services.loadRepositories();
      const repositories = result.data.repositories;
      const r = repositories.map(e => {
        const x = {
          value: e.name,
          label: e.name
        };
        return x;
      });

      dispatch(types.loadReposSuccess(r));
    } catch (error) {
      dispatch(types.loadReposError(error));
    }
  };
}
