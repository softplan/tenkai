import * as types from './actionTypes';
import * as services from 'services/deploy';
import * as global from 'stores/global/actions';

export function loadProductCharts(data) {
  return async dispatch => {
    dispatch(types.loadProductCharts(data));
  };
}

export function loadMultiEnvDeployWithoutProduct(data) {
  return async dispatch => {
    dispatch(types.loadMultiEnvDeployWithoutProduct(data));
  };
}

export function deploy(data) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());
      await services.deploy(data);
      dispatch(global.handleSuccess(types.deploySuccess));
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.deployError));
    }
  };
}
