import * as types from "./actionTypes";

const initialState = {
  dependencies: [],
  loading: false,
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.ALL_DEPENDENCIES_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.ALL_DEPENDENCIES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };

    case types.ALL_DEPENDENCIES_SUCCESS:
      return {
        ...state,
        loading: false,
        dependencies: action.payload.dependencies
      };

    default:
      return state;
  }
}

export function getDependencies(state) {
  return state.dependencie.dependencies;
}

export function getLoading(state) {
  return state.dependencie.loading;
}

export function getError(state) {
  return state.dependencie.error;
}
