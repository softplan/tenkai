import { success, error } from 'react-notification-system-redux';

export const successOpts = {
  title: 'Success!',
  message: 'Your request has been completed successfully!',
  position: 'tr',
  autoDismiss: 3
};

export const errorOpts = {
  title: 'Error!',
  message: 'Something went wrong!',
  position: 'tr',
  autoDismiss: 3,
  level: 'error'
};

export function errorDefault(err) {
  if (err !== undefined) {
    let msg = errorOpts;
    if (!!err.data) {
      msg.message = err.data;
    } else if (!!err.response.data) {
      msg.message = err.response.data;
    } else if (!!err.message) {
      msg.message = err.message;
    }

    return error(msg);
  }
  return error(errorOpts);
}

export function errorWithMessage(message) {
  let msg = errorOpts;
  msg.message = message;
  return msg;
}

export function successDefault() {
  return success(successOpts);
}
