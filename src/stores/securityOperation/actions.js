import * as types from './actionTypes';
import * as services from 'services/securityOperation';
import * as global from 'stores/global/actions';

export function load() {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());
      const result = await services.load();
      const list = result.data.list;

      dispatch(global.successWithParam(types.loadSuccess, list));
    } catch (e) {
      dispatch(global.handleError(e, types.loadError));
    }
  };
}

export function save(data) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());
      console.log(data);
      await services.save(data);
      const result = await services.load();
      const list = result.data.list;
      dispatch(global.successWithParam(types.saveSuccess, list));
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.saveError));
    }
  };
}

export function deleteSecurityOperation(id) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.deleteSecurityOperation(id);

      //const result = await services.load();
      //const list = result.data.list;

      dispatch(global.successWithParam(types.deleteSuccess, id));
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.deleteError));
    }
  };
}
