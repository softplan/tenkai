import * as types from './actionTypes';

const initialState = {
  users: [],
  loading: false,
  loadingDelete: false,
  loadingSave: false,
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.ALL_USER_ERROR:
    case types.DELETE_USER_ERROR:
    case types.SAVE_USER_ERROR:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        error: action.payload.error
      };

    case types.ALL_USER_SUCCESS:
    case types.DELETE_USER_SUCCESS:
    case types.SAVE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        users: action.payload.users
      };

    default:
      return state;
  }
}

export function getUsers(state) {
  return state.user.users;
}

export function getLoading(state) {
  return state.user.loading;
}

export function getLoadingDelete(state) {
  return state.user.loadingDelete;
}

export function getError(state) {
  return state.user.error;
}
