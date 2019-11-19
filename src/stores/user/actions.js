import * as types from './actionTypes';
import * as services from 'services/users';

export function allUsers() {
  return async dispatch => {
    try {
      dispatch(types.allUserBegin());

      const result = await services.allUsers();
      const users = result.data.users;

      dispatch(types.allUserSuccess(users));
    } catch (error) {
      dispatch(types.allUserError(error));
    }
  };
}

export function deleteUser(userId) {
  return async dispatch => {
    try {
      dispatch(types.deleteUserBegin());

      await services.deleteUser(userId);
      const result = await services.allUsers();
      const users = result.data.users;

      dispatch(types.deleteUserSuccess(users));
    } catch (error) {
      dispatch(types.deleteUserError(error));
    }
  };
}

export function saveUser(data) {
  return async dispatch => {
    try {
      dispatch(types.saveUserBegin());

      let user = {
        email: data.email,
        environments: data.checkedEnvs.map(item => ({ ID: parseInt(item) }))
      };

      await services.saveUser(user);
      const result = await services.allUsers();
      const users = result.data.users;

      dispatch(types.saveUserSuccess(users));
    } catch (error) {
      dispatch(types.saveUserError(error));
    }
  };
}
