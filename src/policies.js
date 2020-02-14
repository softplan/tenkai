export const ACTION_DEPLOY = 'ACTION_DEPLOY';
export const ACTION_SAVE_VARIABLES = 'ACTION_SAVE_VARIABLES';
export const ACTION_DELETE_VARIABLES = 'ACTION_DELETE_VARIABLES';
export const ACTION_PROMOTE_ENVIRONMENT = 'ACTION_PROMOTE_ENVIRONMENT';
export const ACTION_HANDLE_RELEASE = 'ACTION_HANDLE_RELEASE';
export const PROFILE_ADMIN = 'PROFILE_ADMIN';
export const PROFILE_BASIC = 'PROFILE_BASIC';

var security_policies = new Map([
  [ACTION_DEPLOY, 'Enable deploy button'],
  [ACTION_SAVE_VARIABLES, 'Enable save variables button'],
  [ACTION_DELETE_VARIABLES, 'Enable delete variables button'],
  [ACTION_PROMOTE_ENVIRONMENT, 'Enable Promote environment button'],
  [ACTION_HANDLE_RELEASE, 'Enable Open/Close Release Button'],
  [PROFILE_ADMIN, 'Show Administrative Features'],
  [PROFILE_BASIC, 'Show Basic Features']
]);

export default security_policies;
