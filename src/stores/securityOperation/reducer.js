import * as types from './actionTypes';

const initialState = {
  list: []
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOAD_SUCCESS:
    case types.SAVE_SUCCESS:
      return {
        ...state,
        list: action.payload.list
      };
    case types.DELETE_SUCCESS:
      return {
        ...state,
        list: state.list.filter(i => i.ID !== action.payload.id)
      };
    case types.LOAD_ERROR:
    case types.SAVE_ERROR:
    case types.DELETE_ERROR:
      return {
        ...state,
        error: action.payload.error
      };

    default:
      return state;
  }
}

export function getState(state) {
  return state.securityOperation;
}

export function getUserEnvironmentPolicies(state) {
  return state.policies;
}
