import * as types from './actionTypes';

const initialState = {
  loading: false,
  error: null,
  repositories: [],
  charts: [],
  selectedRepository: {},
  selectedChart: {}
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.SELECT_REPOSITORY:
      return {
        ...state,
        selectedRepository: action.payload.selectedRepository
      };

    case types.SELECT_CHART:
      return {
        ...state,
        selectedChart: action.payload.selectedChart
      };

    case types.SELECT_TAG:
      return {
        ...state,
        selectedTag: action.payload.selectedTag
      };

    case types.LOAD_REPOS_BEGIN:
    case types.LOAD_DOCKER_TAGS_BEGIN:
    case types.LOAD_CHART_BEGIN:
    case types.LOAD_VARIABLES_BEGIN:
    case types.SAVE_VARIABLES_BEGIN:
    case types.INSTALL_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.LOAD_REPOS_SUCCESS:
      return {
        ...state,
        loading: false,
        repositories: action.payload.repositories
      };

    case types.LOAD_CHART_SUCCESS:
      return {
        ...state,
        loading: false,
        charts: action.payload.charts
      };

    case types.LOAD_VARIABLES_SUCCESS:
      return {
        ...state,
        loading: false,
        variables: action.payload.variables
      };

    case types.SAVE_VARIABLES_SUCCESS:
      return {
        ...state,
        loading: false
      };

    case types.INSTALL_SUCCESS:
      return {
        ...state,
        loading: false
      };

    case types.LOAD_DOCKER_TAGS_SUCCESS:
      return {
        ...state,
        loading: false,
        dockerTags: action.payload.dockerTags
      };

    case types.LOAD_CHART_ERROR:
    case types.LOAD_DOCKER_TAGS_ERROR:
    case types.LOAD_REPOS_ERROR:
    case types.LOAD_VARIABLES_ERROR:
    case types.SAVE_VARIABLES_ERROR:
    case types.INSTALL_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };

    default:
      return state;
  }
}

export function getLoading(state) {
  return state.loading;
}

export function getError(state) {
  return state.error;
}

export function getSimpleDeploy(state) {
  return state.simpleDeploy;
}
