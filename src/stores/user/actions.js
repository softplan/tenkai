import * as types from './actionTypes';
import * as services from 'services/users';
import * as roleServices from 'services/roles';
import * as global from 'stores/global/actions';

export function allUsers() {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      const result = await services.allUsers();
      const users = result.data.users;

      dispatch(global.successWithParam(types.allUserSuccess, users));
    } catch (error) {
      dispatch(global.handleError(error, types.allUserError));
    }
  };
}

export function deleteUser(userId) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.deleteUser(userId);
      const result = await services.allUsers();
      const users = result.data.users;

      dispatch(global.successWithParam(types.deleteUserSuccess, users));
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.deleteUserError));
    }
  };
}

export function saveUser(data) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      let user = {
        ID: data.ID,
        email: data.email,
        environments: data.checkedEnvs.map(item => ({ ID: parseInt(item) }))
      };

      await services.saveUser(user);
      const result = await services.allUsers();
      const users = result.data.users;

      dispatch(global.successWithParam(types.saveUserSuccess, users));
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.saveUserError));
    }
  };
}

export function saveRoles(data) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      let payload = {
        userId: data.userId,
        environmentId: data.selectEnvironment,
        securityOperationId: data.selectedRole.value
      };
      console.log(payload);
      await roleServices.save(payload);

      dispatch(global.handleSuccess(types.saveRoleSuccess));
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.saveUserError));
    }
  };
}
