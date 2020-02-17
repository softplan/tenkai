export const ACTION_DEPLOY = 'ACTION_DEPLOY';
export const ACTION_SAVE_VARIABLES = 'ACTION_SAVE_VARIABLES';

var security_policies = new Map([
  [ACTION_DEPLOY, 'Enable deploy button'],
  [ACTION_SAVE_VARIABLES, 'Enable save variables button']
]);

export default security_policies;
