export const ALL_USER_SUCCESS = 'user.ALL_SUCCESS';
export const ALL_USER_ERROR = 'user.ALL_ERROR';

export const DELETE_USER_SUCCESS = 'user.DELETE_SUCCESS';
export const DELETE_USER_ERROR = 'user.DELETE_ERROR';

export const SAVE_USER_SUCCESS = 'user.SAVE_SUCCESS';
export const SAVE_USER_ERROR = 'user.SAVE_ERROR';

export const SAVE_ROLE_SUCCESS = 'SAVE_ROLE_SUCCESS';
export const SAVE_ROLE_ERROR = 'SAVE_ROLE_ERROR';

export const allUserSuccess = users => ({
  type: ALL_USER_SUCCESS,
  payload: { users }
});

export const allUserError = error => ({
  type: ALL_USER_ERROR,
  payload: { error }
});

export const saveUserSuccess = users => ({
  type: SAVE_USER_SUCCESS,
  payload: { users }
});

export const saveUserError = error => ({
  type: SAVE_USER_ERROR,
  payload: { error }
});

export const saveRoleSuccess = users => ({
  type: SAVE_ROLE_SUCCESS
});

export const saveRoleError = error => ({
  type: SAVE_ROLE_ERROR,
  payload: { error }
});


export const deleteUserSuccess = users => ({
  type: DELETE_USER_SUCCESS,
  payload: { users }
});

export const deleteUserError = error => ({
  type: DELETE_USER_ERROR,
  payload: { error }
});
