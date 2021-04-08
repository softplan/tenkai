import * as types from './actionTypes';

const initialState = {
  error: null,
  repositories: [],
  charts: [],
  selectedRepository: {},
  selectedChart: {},
  image: ''
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.SELECT_REPOSITORY:
      return {
        ...state,
        selectedRepository: action.payload.selectedRepository,
        selectedChart: {},
        selectedTag: {},
        image: ''
      };

    case types.SELECT_CHART:
      return {
        ...state,
        selectedChart: action.payload.selectedChart,
        selectedTag: {}
      };

    case types.SELECT_TAG:
      return {
        ...state,
        selectedTag: action.payload.selectedTag
      };

    case types.LOAD_REPOS_SUCCESS:
      return {
        ...state,
        repositories: action.payload.repositories
      };

    case types.LOAD_CHART_SUCCESS:
      return {
        ...state,
        charts: action.payload.charts
      };

    case types.LOAD_VARIABLES_SUCCESS:
      return {
        ...state,
        variables: action.payload.variables,
        image: action.payload.image
      };

    case types.SAVE_VARIABLES_SUCCESS:
    case types.INSTALL_SUCCESS:
      return {
        ...state
      };

    case types.LOAD_DOCKER_TAGS_SUCCESS:
      return {
        ...state,
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
        error: action.payload.error
      };

    default:
      return state;
  }
}

export function getLoading(state) {
  return state.simpleDeploy.loading;
}

export function getError(state) {
  return state.simpleDeploy.error;
}

export function getSimpleDeploy(state) {
  return state.simpleDeploy;
}
