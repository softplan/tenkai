import * as types from './actionTypes';
import * as services from 'services/webHooks';
import * as global from 'stores/global/actions';

export function allWebHooks() {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      const result = await services.allWebHooks();
      const webHooks = result.data.list;

      dispatch(global.successWithParam(types.allWebHookSuccess, webHooks));
    } catch (error) {
      dispatch(global.handleError(error, types.allWebHookError));
    }
  };
}

export function deleteWebHook(ruleId) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.deleteWebHook(ruleId);
      const result = await services.allWebHooks();
      const webHooks = result.data.list;

      dispatch(global.successWithParam(types.deleteWebHookSuccess, webHooks));
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.deleteWebHookError));
    }
  };
}

export function createWebHook(data) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.createWebHook(data);
      const result = await services.allWebHooks();
      const webHooks = result.data.list;

      dispatch(global.successWithParam(types.createWebHookSuccess, webHooks));
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.createWebHookError));
    }
  };
}

export function editWebHook(data) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.editWebHook(data);
      const result = await services.allWebHooks();
      const webHooks = result.data.list;

      dispatch(global.successWithParam(types.editWebHookSuccess, webHooks));
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.editWebHookError));
    }
  };
}

export function loadWebhookTypes() {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());
      const webHookTypes = await services.loadWebhookTypes();
      dispatch(global.successWithParam(types.loadWebhookTypes, webHookTypes));
    } catch (e) {
      dispatch(global.handleError(e, types.loadWebhookTypesError));
    }
  };
}

export function selectHookType(hookType) {
  return async dispatch => {
    dispatch(types.selectHookType(hookType));
  };
}
