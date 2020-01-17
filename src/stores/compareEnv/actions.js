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
