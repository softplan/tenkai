export const ALL_VARIABLE_RULE_BEGIN = 'variableRule.ALL_VARIABLE_RULE_BEGIN';
export const ALL_VARIABLE_RULE_SUCCESS =
  'variableRule.ALL_VARIABLE_RULE_SUCCESS';
export const ALL_VARIABLE_RULE_ERROR = 'variableRule.ALL_VARIABLE_RULE_ERROR';

export const DELETE_VARIABLE_RULE_BEGIN =
  'variableRule.DELETE_VARIABLE_RULE_BEGIN';
export const DELETE_VARIABLE_RULE_SUCCESS =
  'variableRule.DELETE_VARIABLE_RULE_SUCCESS';
export const DELETE_VARIABLE_RULE_ERROR =
  'variableRule.DELETE_VARIABLE_RULE_ERROR';

export const CREATE_VARIABLE_RULE_BEGIN =
  'variableRule.CREATE_VARIABLE_RULE_BEGIN';
export const CREATE_VARIABLE_RULE_SUCCESS =
  'variableRule.CREATE_VARIABLE_RULE_SUCCESS';
export const CREATE_VARIABLE_RULE_ERROR =
  'variableRule.CREATE_VARIABLE_RULE_ERROR';

export const EDIT_VARIABLE_RULE_BEGIN = 'variableRule.EDIT_VARIABLE_RULE_BEGIN';
export const EDIT_VARIABLE_RULE_SUCCESS =
  'variableRule.EDIT_VARIABLE_RULE_SUCCESS';
export const EDIT_VARIABLE_RULE_ERROR = 'variableRule.EDIT_VARIABLE_RULE_ERROR';

export const allVariableRuleBegin = () => ({
  type: ALL_VARIABLE_RULE_BEGIN
});

export const allVariableRuleSuccess = variableRules => ({
  type: ALL_VARIABLE_RULE_SUCCESS,
  payload: { variableRules }
});

export const allVariableRuleError = error => ({
  type: ALL_VARIABLE_RULE_ERROR,
  payload: { error }
});

export const createVariableRuleBegin = () => ({
  type: CREATE_VARIABLE_RULE_BEGIN
});

export const createVariableRuleSuccess = variableRules => ({
  type: CREATE_VARIABLE_RULE_SUCCESS,
  payload: { variableRules }
});

export const createVariableRuleError = error => ({
  type: CREATE_VARIABLE_RULE_ERROR,
  payload: { error }
});

export const editVariableRuleBegin = () => ({
  type: EDIT_VARIABLE_RULE_BEGIN
});

export const editVariableRuleSuccess = variableRules => ({
  type: EDIT_VARIABLE_RULE_SUCCESS,
  payload: { variableRules }
});

export const editVariableRuleError = error => ({
  type: EDIT_VARIABLE_RULE_ERROR,
  payload: { error }
});

export const deleteVariableRuleBegin = () => ({
  type: DELETE_VARIABLE_RULE_BEGIN
});

export const deleteVariableRuleSuccess = variableRules => ({
  type: DELETE_VARIABLE_RULE_SUCCESS,
  payload: { variableRules }
});

export const deleteVariableRuleError = error => ({
  type: DELETE_VARIABLE_RULE_ERROR,
  payload: { error }
});
