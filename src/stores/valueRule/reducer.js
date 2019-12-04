import * as types from './actionTypes';

const initialState = {
  valueRules: [],
  ruleTypes: [],
  loading: false,
  loadingDelete: false,
  loadingSave: false,
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.ALL_VALUE_RULE_BEGIN:
    case types.ALL_RULE_TYPES_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_VALUE_RULE_BEGIN:
      return {
        loadingDelete: true,
        ...state
      };

    case types.CREATE_VALUE_RULE_BEGIN:
    case types.EDIT_VALUE_RULE_BEGIN:
      return {
        ...state,
        loadingSave: true,
        error: null
      };

    case types.ALL_VALUE_RULE_ERROR:
    case types.DELETE_VALUE_RULE_ERROR:
    case types.CREATE_VALUE_RULE_ERROR:
    case types.EDIT_VALUE_RULE_ERROR:
    case types.ALL_RULE_TYPES_ERROR:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        error: action.payload.error
      };

    case types.ALL_VALUE_RULE_SUCCESS:
    case types.DELETE_VALUE_RULE_SUCCESS:
    case types.CREATE_VALUE_RULE_SUCCESS:
    case types.EDIT_VALUE_RULE_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        valueRules: action.payload.valueRules
      };

    case types.ALL_RULE_TYPES_SUCCESS:
      return {
        ...state,
        loading: false,
        ruleTypes: action.payload.ruleTypes
      };

    default:
      return state;
  }
}

export function getVariableRules(state) {
  return state.variableRule.variableRules;
}

export function getRules(state) {
  return state.valueRule.valueRules;
}

export function getRuleTypes(state) {
  return state.valueRule.ruleTypes;
}

export function getLoading(state) {
  return state.valueRule.loading;
}

export function getLoadingDelete(state) {
  return state.valueRule.loadingDelete;
}

export function getError(state) {
  return state.valueRule.error;
}
