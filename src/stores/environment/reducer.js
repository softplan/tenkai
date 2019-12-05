import * as types from './actionTypes';

const initialState = {
  environments: [],
  loading: false,
  loadingDelete: false,
  loadingSave: false,
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.DUPLICATE_ENVIRONMENT_BEGIN:
    case types.ALL_ENVIRONMENT_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_ENVIRONMENT_BEGIN:
      return {
        loadingDelete: true,
        ...state
      };

    case types.CREATE_ENVIRONMENT_BEGIN:
    case types.EDIT_ENVIRONMENT_BEGIN:
      return {
        ...state,
        loadingSave: true,
        error: null
      };

    case types.DUPLICATE_ENVIRONMENT_ERROR:
    case types.ALL_ENVIRONMENT_ERROR:
    case types.CREATE_ENVIRONMENT_ERROR:
    case types.EDIT_ENVIRONMENT_ERROR:
    case types.DELETE_ENVIRONMENT_ERROR:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        error: action.payload.error
      };

    case types.DUPLICATE_ENVIRONMENT_SUCCESS:
    case types.ALL_ENVIRONMENT_SUCCESS:
    case types.CREATE_ENVIRONMENT_SUCCESS:
    case types.EDIT_ENVIRONMENT_SUCCESS:
    case types.DELETE_ENVIRONMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        error: null,
        environments: action.payload.environments
      };

    default:
      return state;
  }
}

export function getEnvironments(state) {
  return state.environment.environments;
}

export function getLoading(state) {
  return state.environment.loading;
}

export function getError(state) {
  return state.environment.error;
}
