import * as types from './actionTypes';

export function increaseLoading() {
  return async dispatch => {
    dispatch(types.showSpinner());
  };
}

export function decreaseLoading() {
  return async dispatch => {
    dispatch(types.hideSpinner());
  };
}
