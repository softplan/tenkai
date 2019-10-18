import * as types from "./actionTypes";

const initialState = {
  dependencies: [],
  loading: false,
  loadingDelete: false,
  loadingSave: false,
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.ALL_DEPENDENCY_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_DEPENDENCY_BEGIN:
      return {
        loadingDelete: true,
        ...state
      };

    case types.CREATE_DEPENDENCY_BEGIN:
    case types.EDIT_DEPENDENCY_BEGIN:
      return {
        ...state,
        loadingSave: true,
        error: null
      };

    case types.ALL_DEPENDENCY_ERROR:
    case types.DELETE_DEPENDENCY_ERROR:
    case types.CREATE_DEPENDENCY_ERROR:
    case types.EDIT_DEPENDENCY_ERROR:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        error: action.payload.error
      };

    case types.ALL_DEPENDENCY_SUCCESS:
    case types.DELETE_DEPENDENCY_SUCCESS:
    case types.CREATE_DEPENDENCY_SUCCESS:
    case types.EDIT_DEPENDENCY_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        dependencies: action.payload.dependencies
      };

    default:
      return state;
  }
}

export function getDependencies(state) {
  return state.dependency.dependencies;
}

export function getLoading(state) {
  return state.dependency.loading;
}

export function getLoadingDelete(state) {
  return state.dependency.loadingDelete;
}

export function getError(state) {
  return state.dependency.error;
}
