import * as types from './actionTypes';

const initialState = {
  loadingCount: 0
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.INCREASE_LOADING:
      return {
        ...state,
        loadingCount: state.loadingCount + 1
      };

    case types.DECREASE_LOADING:
      return {
        ...state,
        loadingCount: state.loadingCount - 1
      };

    default:
      return state;
  }
}

export function getLoadingCount(state) {
  return state.spinner.loadingCount;
}
