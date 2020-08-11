import * as types from './actionTypes';

const initialState = {
  webHooks: [],
  webHookTypes: [],
  selectedHookType: {},
  loading: false,
  loadingDelete: false,
  loadingSave: false,
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.ALL_WEB_HOOK_ERROR:
    case types.DELETE_WEB_HOOK_ERROR:
    case types.CREATE_WEB_HOOK_ERROR:
    case types.EDIT_WEB_HOOK_ERROR:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        error: action.payload.error
      };

    case types.ALL_WEB_HOOK_SUCCESS:
    case types.DELETE_WEB_HOOK_SUCCESS:
    case types.CREATE_WEB_HOOK_SUCCESS:
    case types.EDIT_WEB_HOOK_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        webHooks: action.payload.webHooks
      };

    case types.LOAD_WEB_HOOK_TYPES_SUCCESS:
      return {
        ...state,
        webHookTypes: action.payload.webHookTypes
      };

    case types.SELECT_WEB_HOOK_TYPE:
      return {
        ...state,
        selectedHookType: action.payload.hookType
      };

    default:
      return state;
  }
}

export function getWebHook(state) {
  return state.webHook;
}

export function getWebHookLoading(state) {
  return state.webHook.loading;
}

export function getWebHookError(state) {
  return state.webHook.error;
}
