import * as types from './actionTypes';

const initialState = {
  list: [],
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOAD_SUCCESS:
    case types.SAVE_SUCCESS:
      return {
        ...state,
        list: action.payload.list
      };

      
    case types.LOAD_ERROR:
    case types.SAVE_ERROR:
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
