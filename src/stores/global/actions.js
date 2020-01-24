import * as spinner from 'stores/spinner/actionTypes';
import * as messages from 'components/Notification/defaultMessages';
import { error } from 'react-notification-system-redux';

export function handleError(e, action) {
  return async dispatch => {
    dispatch(action(e));
    dispatch(messages.errorDefault(e));
    dispatch(spinner.hide());
  };
}

export function successWithParam(actionSuccess, param) {
  return async dispatch => {
    dispatch(actionSuccess(param));
    dispatch(spinner.hide());
  };
}

export function handleSuccess(actionSuccess) {
  return async dispatch => {
    dispatch(actionSuccess());
    dispatch(spinner.hide());
  };
}

export function hideSpinner() {
  return async dispatch => {
    dispatch(spinner.hide());
  };
}

export function beginLoad() {
  return async dispatch => {
    dispatch(spinner.show());
  };
}

export function successDefaultMessage() {
  return async dispatch => {
    dispatch(messages.successDefault());
  };
}

export function errorMessage(msg) {
  return async dispatch => {
    dispatch(error(messages.errorWithMessage(msg)));
  };
}
