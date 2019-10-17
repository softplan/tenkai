import * as types from "./actionTypes";

const initialState = {
  dependencies: [],
  loading: false,
  loadingDelete: false,
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

    case types.ALL_DEPENDENCY_ERROR:
    case types.DELETE_DEPENDENCY_ERROR:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        error: action.payload.error
      };

    case types.ALL_DEPENDENCY_SUCCESS:
    case types.DELETE_DEPENDENCY_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
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
