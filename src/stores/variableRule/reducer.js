import * as types from './actionTypes';

const initialState = {
  variableRules: [],
  loading: false,
  loadingDelete: false,
  loadingSave: false,
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.ALL_VARIABLE_RULE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_VARIABLE_RULE_BEGIN:
      return {
        loadingDelete: true,
        ...state
      };

    case types.CREATE_VARIABLE_RULE_BEGIN:
    case types.EDIT_VARIABLE_RULE_BEGIN:
      return {
        ...state,
        loadingSave: true,
        error: null
      };

    case types.ALL_VARIABLE_RULE_ERROR:
    case types.DELETE_VARIABLE_RULE_ERROR:
    case types.CREATE_VARIABLE_RULE_ERROR:
    case types.EDIT_VARIABLE_RULE_ERROR:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        error: action.payload.error
      };

    case types.ALL_VARIABLE_RULE_SUCCESS:
    case types.DELETE_VARIABLE_RULE_SUCCESS:
    case types.CREATE_VARIABLE_RULE_SUCCESS:
    case types.EDIT_VARIABLE_RULE_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        variableRules: action.payload.variableRules
      };

    default:
      return state;
  }
}

export function getVariableRules(state) {
  return state.variableRule.variableRules;
}

export function getVariableLoading(state) {
  return state.variableRule.loading;
}

export function getVariableLoadingDelete(state) {
  return state.variableRule.loadingDelete;
}

export function getVariableError(state) {
  return state.variableRule.error;
}
