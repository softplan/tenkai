import * as types from './actionTypes';
import * as services from 'services/valueRules';

export function allValueRules(variableRuleId) {
  return async dispatch => {
    try {
      dispatch(types.allValueRuleBegin());

      const result = await services.allValueRules(variableRuleId);
      const rules = result.data.list;

      dispatch(types.allValueRuleSuccess(rules));
    } catch (error) {
      dispatch(types.allValueRuleError(error));
    }
  };
}

export function deleteValueRule(valueRuleId, variableRuleId) {
  return async dispatch => {
    try {
      dispatch(types.deleteValueRuleBegin());

      await services.deleteValueRule(valueRuleId);
      const result = await services.allValueRules(variableRuleId);
      const rules = result.data.list;

      dispatch(types.deleteValueRuleSuccess(rules));
    } catch (error) {
      dispatch(types.deleteValueRuleError(error));
    }
  };
}

export function createValueRule(data) {
  return async dispatch => {
    try {
      dispatch(types.createValueRuleBegin());

      await services.createValueRule(data);
      const result = await services.allValueRules(data.variableRuleId);
      const rules = result.data.list;

      dispatch(types.createValueRuleSuccess(rules));
    } catch (error) {
      dispatch(types.createValueRuleError(error));
    }
  };
}

export function editValueRule(data) {
  return async dispatch => {
    try {
      dispatch(types.editValueRuleBegin());

      await services.editValueRule(data);
      const result = await services.allValueRules(data.variableRuleId);
      const rules = result.data.list;

      dispatch(types.editValueRuleSuccess(rules));
    } catch (error) {
      dispatch(types.editValueRuleError(error));
    }
  };
}

export function allRuleTypes() {
  return async dispatch => {
    try {
      dispatch(types.allRuleTypesBegin());
      const ruleTypes = await services.allRuleTypes();
      dispatch(types.allRuleTypesSuccess(ruleTypes));
    } catch (error) {
      dispatch(types.allRuleTypesError(error));
    }
  };
}
