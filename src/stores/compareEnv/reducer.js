import * as types from './actionTypes';

const initialState = {
  loading: false,
  error: null,
  envsDiff: [],
  repositories: []
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.COMPARE_ENV_BEGIN:
    case types.LOAD_REPOS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
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
        loading: false,
        envsDiff: action.payload.envsDiff
      };

    case types.LOAD_REPOS_SUCCESS:
      const newState = {
        ...state,
        loading: false,
        repositories: action.payload.repositories
      };
      console.log(newState);
      return newState;

    case types.COMPARE_ENV_ERROR:
    case types.LOAD_REPOS_ERROR:
      return {
        ...state,
        loading: false,
        envsDiff: action.payload.error
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

export function getCompareEnv(state) {
  return state.compareEnv;
}
