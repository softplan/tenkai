export const ALL_VALUE_RULE_BEGIN = 'valueRule.ALL_VALUE_RULE_BEGIN';
export const ALL_VALUE_RULE_SUCCESS = 'valueRule.ALL_VALUE_RULE_SUCCESS';
export const ALL_VALUE_RULE_ERROR = 'valueRule.ALL_VALUE_RULE_ERROR';

export const DELETE_VALUE_RULE_BEGIN = 'valueRule.DELETE_VALUE_RULE_BEGIN';
export const DELETE_VALUE_RULE_SUCCESS = 'valueRule.DELETE_VALUE_RULE_SUCCESS';
export const DELETE_VALUE_RULE_ERROR = 'valueRule.DELETE_VALUE_RULE_ERROR';

export const CREATE_VALUE_RULE_BEGIN = 'valueRule.CREATE_VALUE_RULE_BEGIN';
export const CREATE_VALUE_RULE_SUCCESS = 'valueRule.CREATE_VALUE_RULE_SUCCESS';
export const CREATE_VALUE_RULE_ERROR = 'valueRule.CREATE_VALUE_RULE_ERROR';

export const EDIT_VALUE_RULE_BEGIN = 'valueRule.EDIT_VALUE_RULE_BEGIN';
export const EDIT_VALUE_RULE_SUCCESS = 'valueRule.EDIT_VALUE_RULE_SUCCESS';
export const EDIT_VALUE_RULE_ERROR = 'valueRule.EDIT_VALUE_RULE_ERROR';

export const ALL_RULE_TYPES_BEGIN = 'valueRule.ALL_RULE_TYPES_BEGIN';
export const ALL_RULE_TYPES_SUCCESS = 'valueRule.ALL_RULE_TYPES_SUCCESS';
export const ALL_RULE_TYPES_ERROR = 'valueRule.ALL_RULE_TYPES_ERROR';

export const allValueRuleBegin = () => ({
  type: ALL_VALUE_RULE_BEGIN
});

export const allValueRuleSuccess = valueRules => ({
  type: ALL_VALUE_RULE_SUCCESS,
  payload: { valueRules }
});

export const allValueRuleError = error => ({
  type: ALL_VALUE_RULE_ERROR,
  payload: { error }
});

export const createValueRuleBegin = () => ({
  type: CREATE_VALUE_RULE_BEGIN
});

export const createValueRuleSuccess = valueRules => ({
  type: CREATE_VALUE_RULE_SUCCESS,
  payload: { valueRules }
});

export const createValueRuleError = error => ({
  type: CREATE_VALUE_RULE_ERROR,
  payload: { error }
});

export const editValueRuleBegin = () => ({
  type: EDIT_VALUE_RULE_BEGIN
});

export const editValueRuleSuccess = valueRules => ({
  type: EDIT_VALUE_RULE_SUCCESS,
  payload: { valueRules }
});

export const editValueRuleError = error => ({
  type: EDIT_VALUE_RULE_ERROR,
  payload: { error }
});

export const deleteValueRuleBegin = () => ({
  type: DELETE_VALUE_RULE_BEGIN
});

export const deleteValueRuleSuccess = valueRules => ({
  type: DELETE_VALUE_RULE_SUCCESS,
  payload: { valueRules }
});

export const deleteValueRuleError = error => ({
  type: DELETE_VALUE_RULE_ERROR,
  payload: { error }
});

export const allRuleTypesBegin = () => ({
  type: ALL_RULE_TYPES_BEGIN
});

export const allRuleTypesSuccess = ruleTypes => ({
  type: ALL_RULE_TYPES_SUCCESS,
  payload: { ruleTypes }
});

export const allRuleTypesError = error => ({
  type: ALL_RULE_TYPES_ERROR,
  payload: { error }
});
