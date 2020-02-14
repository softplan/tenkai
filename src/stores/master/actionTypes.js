export const LOAD_ROLE_SUCCESS = 'LOAD_ROLE_SUCCESS';
export const LOAD_ERROR = 'LOAD_ERROR';

export const loadRoleSuccess = result => ({
  type: LOAD_ROLE_SUCCESS,
  payload: { result }
});

export const loadError = error => ({
  type: LOAD_ERROR,
  payload: { error }
});
