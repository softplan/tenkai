import * as types from "./actionTypes";

const initialState = {
  solutions: [],
  loading: false,
  loadingDelete: false,
  loadingSave: false,
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.ALL_SOLUTION_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_SOLUTION_BEGIN:
      return {
        loadingDelete: true,
        ...state
      };

    case types.CREATE_SOLUTION_BEGIN:
    case types.EDIT_SOLUTION_BEGIN:
      return {
        ...state,
        loadingSave: true,
        error: null
      };

    case types.ALL_SOLUTION_ERROR:
    case types.DELETE_SOLUTION_ERROR:
    case types.CREATE_SOLUTION_ERROR:
    case types.EDIT_SOLUTION_ERROR:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        error: action.payload.error
      };

    case types.ALL_SOLUTION_SUCCESS:
    case types.DELETE_SOLUTION_SUCCESS:
    case types.CREATE_SOLUTION_SUCCESS:
    case types.EDIT_SOLUTION_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        solutions: action.payload.solutions
      };

    default:
      return state;
  }
}

export function getSolutions(state) {
  return state.solution.solutions;
}

export function getLoading(state) {
  return state.solution.loading;
}

export function getLoadingDelete(state) {
  return state.solution.loadingDelete;
}

export function getError(state) {
  return state.solution.error;
}
