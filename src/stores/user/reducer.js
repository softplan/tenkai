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
    case types.ALL_USER_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_USER_BEGIN:
      return {
        loadingDelete: true,
        ...state
      };

    case types.CREATE_USER_BEGIN:
    case types.EDIT_USER_BEGIN:
      return {
        ...state,
        loadingSave: true,
        error: null
      };

    case types.ALL_USER_ERROR:
    case types.DELETE_USER_ERROR:
    case types.CREATE_USER_ERROR:
    case types.EDIT_USER_ERROR:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        error: action.payload.error
      };

    case types.ALL_USER_SUCCESS:
    case types.DELETE_USER_SUCCESS:
    case types.CREATE_USER_SUCCESS:
    case types.EDIT_USER_SUCCESS:
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
