import * as types from './actionTypes';
import * as services from 'services/variableRules';

export function allVariableRules() {
  return async dispatch => {
    try {
      dispatch(types.allVariableRuleBegin());

      const result = await services.allVariableRules();
      const rules = result.data.list;

      dispatch(types.allVariableRuleSuccess(rules));
    } catch (error) {
      dispatch(types.allVariableRuleError(error));
    }
  };
}

export function deleteVariableRule(ruleId) {
  return async dispatch => {
    try {
      dispatch(types.deleteVariableRuleBegin());

      await services.deleteVariableRule(ruleId);
      const result = await services.allVariableRules();
      const rules = result.data.list;

      dispatch(types.deleteVariableRuleSuccess(rules));
    } catch (error) {
      dispatch(types.deleteVariableRuleError(error));
    }
  };
}

export function createVariableRule(data) {
  return async dispatch => {
    try {
      dispatch(types.createVariableRuleBegin());

      await services.createVariableRule(data);
      const result = await services.allVariableRules();
      const rules = result.data.list;

      dispatch(types.createVariableRuleSuccess(rules));
    } catch (error) {
      dispatch(types.createVariableRuleError(error));
    }
  };
}

export function editVariableRule(data) {
  return async dispatch => {
    try {
      dispatch(types.editVariableRuleBegin());

      await services.editVariableRule(data);
      const result = await services.allVariableRules();
      const rules = result.data.list;

      dispatch(types.editVariableRuleSuccess(rules));
    } catch (error) {
      dispatch(types.editVariableRuleError(error));
    }
  };
}
