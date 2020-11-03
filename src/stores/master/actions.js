import * as types from './actionTypes';
import * as roleServices from 'services/roles';
import * as global from 'stores/global/actions';

export function loadRole(email, envs) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());
      let resultData = [];
      envs.forEach(async e => {
        let result = await roleServices.getUserPolicyByEnvironment({
          email: email,
          environmentId: e.environmentId
        });
        resultData.push(result.data);
      });
      dispatch(global.successWithParam(types.loadRoleSuccess, resultData));
    } catch (e) {
      dispatch(global.handleError(e, types.loadError));
    }
  };
}
