import * as types from "./actionTypes";

const initialState = {
  solutionCharts: [],
  loading: false,
  loadingDelete: false,
  loadingSave: false,
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.ALL_SOLUTION_CHART_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_SOLUTION_CHART_BEGIN:
      return {
        loadingDelete: true,
        ...state
      };

    case types.CREATE_SOLUTION_CHART_BEGIN:
    case types.EDIT_SOLUTION_CHART_BEGIN:
      return {
        ...state,
        loadingSave: true,
        error: null
      };

    case types.ALL_SOLUTION_CHART_ERROR:
    case types.DELETE_SOLUTION_CHART_ERROR:
    case types.CREATE_SOLUTION_CHART_ERROR:
    case types.EDIT_SOLUTION_CHART_ERROR:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        error: action.payload.error
      };

    case types.ALL_SOLUTION_CHART_SUCCESS:
    case types.DELETE_SOLUTION_CHART_SUCCESS:
    case types.CREATE_SOLUTION_CHART_SUCCESS:
    case types.EDIT_SOLUTION_CHART_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        solutionCharts: action.payload.solutionCharts
      };

    default:
      return state;
  }
}

export function getSolutionCharts(state) {
  return state.solutionChart.solutionCharts;
}

export function getLoading(state) {
  return state.solutionChart.loading;
}

export function getLoadingDelete(state) {
  return state.solutionChart.loadingDelete;
}

export function getError(state) {
  return state.solutionChart.error;
}
