import * as types from './actionTypes';

const initialState = {
  error: null,
  envsDiff: [],
  repositories: [],
  charts: [],
  selectedRepository: {},
  selectedCharts: [],
  filterOnlyExcept: 0
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.SELECT_REPOSITORY:
      return {
        ...state,
        selectedRepository: action.payload.selectedRepository,
        selectedCharts: []
      };

    case types.ADD_CHART:
      return {
        ...state,
        selectedCharts: [...state.selectedCharts, action.payload.selectedChart]
      };

    case types.REMOVE_CHART:
      return {
        ...state,
        selectedCharts: state.selectedCharts.filter(
          i => i !== action.payload.selectedChart
        )
      };

    case types.SELECT_FILTER_ONLY_EXCEPT:
      return {
        ...state,
        filterOnlyExcept: action.payload.filterOnlyExcept
      };

    case types.SELECT_SOURCE_ENVIRONMENT:
      return {
        ...state,
        selectedSrcEnv: action.payload.selectedSrcEnv
      };

    case types.SELECT_TARGET_ENVIRONMENT:
      return {
        ...state,
        selectedTarEnv: action.payload.selectedTarEnv
      };

    case types.COMPARE_ENV_SUCCESS:
      return {
        ...state,
        envsDiff: action.payload.envsDiff
      };

    case types.LOAD_REPOS_SUCCESS:
      const newState = {
        ...state,
        repositories: action.payload.repositories
      };
      console.log(newState);
      return newState;

    case types.LOAD_CHART_SUCCESS:
      return {
        ...state,
        charts: action.payload.charts
      };

    case types.LOAD_CHART_ERROR:
    case types.COMPARE_ENV_ERROR:
    case types.LOAD_REPOS_ERROR:
      return {
        ...state,
        envsDiff: action.payload.error
      };

    default:
      return state;
  }
}

export function getError(state) {
  return state.error;
}

export function getCompareEnv(state) {
  return state.compareEnv;
}
