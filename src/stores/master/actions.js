import * as types from './actionTypes';
import * as roleServices from 'services/roles';
import * as global from 'stores/global/actions';

export function loadRole(email, environmentId) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());
      let result = await roleServices.getUserPolicyByEnvironment({
        email: email,
        environmentId: environmentId
      });
      dispatch(global.successWithParam(types.loadRoleSuccess, result.data));
    } catch (e) {
      dispatch(global.handleError(e, types.loadError));
    }
  };
}
