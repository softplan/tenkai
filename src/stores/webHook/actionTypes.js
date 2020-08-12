export const ALL_WEB_HOOK_SUCCESS = 'webHook.ALL_WEB_HOOK_SUCCESS';
export const ALL_WEB_HOOK_ERROR = 'webHook.ALL_WEB_HOOK_ERROR';

export const DELETE_WEB_HOOK_SUCCESS = 'webHook.DELETE_WEB_HOOK_SUCCESS';
export const DELETE_WEB_HOOK_ERROR = 'webHook.DELETE_WEB_HOOK_ERROR';

export const CREATE_WEB_HOOK_SUCCESS = 'webHook.CREATE_WEB_HOOK_SUCCESS';
export const CREATE_WEB_HOOK_ERROR = 'webHook.CREATE_WEB_HOOK_ERROR';

export const EDIT_WEB_HOOK_SUCCESS = 'webHook.EDIT_WEB_HOOK_SUCCESS';
export const EDIT_WEB_HOOK_ERROR = 'webHook.EDIT_WEB_HOOK_ERROR';

export const LOAD_WEB_HOOK_TYPES_SUCCESS = 'webHook.LOAD_WEB_HOOK_TYPES';
export const LOAD_WEB_HOOK_TYPES_ERROR = 'webHook.LOAD_WEB_HOOK_TYPES_ERROR';

export const SELECT_WEB_HOOK_TYPE = 'webHook.SELECT_WEB_HOOK_TYPE';

export const allWebHookSuccess = webHooks => ({
  type: ALL_WEB_HOOK_SUCCESS,
  payload: { webHooks }
});

export const allWebHookError = error => ({
  type: ALL_WEB_HOOK_ERROR,
  payload: { error }
});

export const createWebHookSuccess = webHooks => ({
  type: CREATE_WEB_HOOK_SUCCESS,
  payload: { webHooks }
});

export const createWebHookError = error => ({
  type: CREATE_WEB_HOOK_ERROR,
  payload: { error }
});

export const editWebHookSuccess = webHooks => ({
  type: EDIT_WEB_HOOK_SUCCESS,
  payload: { webHooks }
});

export const editWebHookError = error => ({
  type: EDIT_WEB_HOOK_ERROR,
  payload: { error }
});

export const deleteWebHookSuccess = webHooks => ({
  type: DELETE_WEB_HOOK_SUCCESS,
  payload: { webHooks }
});

export const deleteWebHookError = error => ({
  type: DELETE_WEB_HOOK_ERROR,
  payload: { error }
});

export const loadWebhookTypes = webHookTypes => ({
  type: LOAD_WEB_HOOK_TYPES_SUCCESS,
  payload: { webHookTypes }
});

export const loadWebhookTypesError = error => ({
  type: LOAD_WEB_HOOK_TYPES_ERROR,
  payload: { error }
});

export const selectHookType = hookType => ({
  type: SELECT_WEB_HOOK_TYPE,
  payload: { hookType }
});
