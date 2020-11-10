import * as types from './actionTypes';
import * as global from 'stores/deploymentStatus/stores/global/actions';

export function deploymentStatus() {
  return async dispatch => {
    try {
      
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.deploymentStatusError));
    }
  };
}
