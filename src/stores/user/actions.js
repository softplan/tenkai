import * as types from './actionTypes';
import * as services from 'services/users';

export function allUsers() {
  return async dispatch => {
    try {
      dispatch(types.allUserBegin());

      const result = await services.allUsers();
      const users = result.data.list;

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
      const users = result.data.list;

      dispatch(types.deleteUserSuccess(users));
    } catch (error) {
      dispatch(types.deleteUserError(error));
    }
  };
}

export function createUser(data) {
  return async dispatch => {
    try {
      dispatch(types.createUserBegin());

      await services.createUser(data);
      const result = await services.allUsers();
      const users = result.data.list;

      dispatch(types.createUserSuccess(users));
    } catch (error) {
      dispatch(types.createUserError(error));
    }
  };
}

export function editUser(data) {
  return async dispatch => {
    try {
      dispatch(types.editUserBegin());

      await services.editUser(data);
      const result = await services.allUsers();
      const users = result.data.list;

      dispatch(types.editUserSuccess(users));
    } catch (error) {
      dispatch(types.editUserError(error));
    }
  };
}
