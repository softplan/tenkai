import * as types from './actionTypes';

const initialState = {
  ID: null,
  CreatedAt: null,
  success: null,
  message:null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    
    case types.DEPLOYMENTSTATUS_SUCCESS:
      return state;

    case types.DEPLOYMENTSTATUS_ERROR:
      return {
        ...state,
        error: action.payload.error
      };

    default:
      return state;
  }
}

export function getDeploymentStatus(state) {
  return state.getDeploymentStatus;
}
