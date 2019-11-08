export const ALL_USER_BEGIN = 'user.ALL_BEGIN';
export const ALL_USER_SUCCESS = 'user.ALL_SUCCESS';
export const ALL_USER_ERROR = 'user.ALL_ERROR';

export const DELETE_USER_BEGIN = 'user.DELETE_BEGIN';
export const DELETE_USER_SUCCESS = 'user.DELETE_SUCCESS';
export const DELETE_USER_ERROR = 'user.DELETE_ERROR';

export const CREATE_USER_BEGIN = 'user.CREATE_BEGIN';
export const CREATE_USER_SUCCESS = 'user.CREATE_SUCCESS';
export const CREATE_USER_ERROR = 'user.CREATE_ERROR';

export const EDIT_USER_BEGIN = 'user.EDIT_BEGIN';
export const EDIT_USER_SUCCESS = 'user.EDIT_SUCCESS';
export const EDIT_USER_ERROR = 'user.EDIT_ERROR';

export const allUserBegin = () => ({
  type: ALL_USER_BEGIN
});

export const allUserSuccess = users => ({
  type: ALL_USER_SUCCESS,
  payload: { users }
});

export const allUserError = error => ({
  type: ALL_USER_ERROR,
  payload: { error }
});

export const createUserBegin = () => ({
  type: CREATE_USER_BEGIN
});

export const createUserSuccess = users => ({
  type: CREATE_USER_SUCCESS,
  payload: { users }
});

export const createUserError = error => ({
  type: CREATE_USER_ERROR,
  payload: { error }
});

export const editUserBegin = () => ({
  type: EDIT_USER_BEGIN
});

export const editUserSuccess = users => ({
  type: EDIT_USER_SUCCESS,
  payload: { users }
});

export const editUserError = error => ({
  type: EDIT_USER_ERROR,
  payload: { error }
});

export const deleteUserBegin = () => ({
  type: DELETE_USER_BEGIN
});

export const deleteUserSuccess = users => ({
  type: DELETE_USER_SUCCESS,
  payload: { users }
});

export const deleteUserError = error => ({
  type: DELETE_USER_ERROR,
  payload: { error }
});
