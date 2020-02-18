export const ACTION_DEPLOY = 'ACTION_DEPLOY';
export const ACTION_SAVE_VARIABLES = 'ACTION_SAVE_VARIABLES';
export const ACTION_DELETE_POD = 'ACTION_DELETE_POD';
export const ACTION_HELM_PURGE = 'ACTION_HELM_PURGE';

var security_policies = new Map([
  [ACTION_DEPLOY, 'Enable deploy button'],
  [ACTION_SAVE_VARIABLES, 'Enable save variables button'],
  [ACTION_DELETE_POD, 'Allow user to delete pod'],
  [ACTION_HELM_PURGE, 'Allow user to purge a helm']
]);

export default security_policies;
