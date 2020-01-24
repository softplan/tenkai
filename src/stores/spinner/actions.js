import * as types from './actionTypes';

export function increaseLoading() {
  return async dispatch => {
    dispatch(types.show());
  };
}

export function decreaseLoading() {
  return async dispatch => {
    dispatch(types.hide());
  };
}
