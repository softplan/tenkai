import * as types from './actionTypes';
import * as services from 'services/environments';

export function allEnvironments() {
  return async dispatch => {
    try {
      dispatch(types.allEnvironmentBegin());

      const result = await services.allEnvironments();
      const environments = result.data.Envs;

      dispatch(types.allEnvironmentSuccess(environments));
    } catch (error) {
      dispatch(types.allEnvironmentError(error));
    }
  };
}

export function createEnvironment(data) {
  return async dispatch => {
    try {
      dispatch(types.createEnvironmentBegin());

      await services.createEnvironment(data);
      const result = await services.allEnvironments();
      const environments = result.data.Envs;

      dispatch(types.createEnvironmentSuccess(environments));
    } catch (error) {
      dispatch(types.createEnvironmentError(error));
    }
  };
}

export function deleteEnvironment(environmentId) {
  return async dispatch => {
    try {
      dispatch(types.deleteEnvironmentBegin());

      await services.deleteEnvironment(environmentId);
      const result = await services.allEnvironments();
      const environments = result.data.Envs;

      dispatch(types.deleteEnvironmentSuccess(environments));
    } catch (error) {
      dispatch(types.deleteEnvironmentError(error));
    }
  };
}

export function editEnvironment(data) {
  return async dispatch => {
    try {
      dispatch(types.editEnvironmentBegin());

      await services.editEnvironment(data);
      const result = await services.allEnvironments();
      const environments = result.data.Envs;

      dispatch(types.editEnvironmentSuccess(environments));
    } catch (error) {
      dispatch(types.editEnvironmentError(error));
    }
  };
}

export function duplicateEnvironment(data) {
  return async dispatch => {
    try {
      dispatch(types.duplicateEnvironmentBegin());

      await services.duplicateEnvironment(data);
      const result = await services.allEnvironments();
      const environments = result.data.Envs;

      dispatch(types.duplicateEnvironmentSuccess(environments));
    } catch (error) {
      dispatch(types.duplicateEnvironmentError(error));
    }
  };
}

export function exportEnvironment(item) {
  return async dispatch => {
    try {
      dispatch(types.exportEnvironmentBegin());

      const result = await services.exportEnvironment(item.ID);

      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `environment_${item.group}_${item.name}.txt`
      );
      document.body.appendChild(link);
      link.click();

      dispatch(types.exportEnvironmentSuccess());
    } catch (error) {
      dispatch(types.exportEnvironmentError(error));
    }
  };
}
