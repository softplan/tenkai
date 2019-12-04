import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export async function allValueRules(variableRuleId) {
  return await axios.get(
    `${TENKAI_API_URL}/valuerules?variableRuleId=${variableRuleId}`
  );
}

export async function deleteValueRule(ruleId) {
  return await axios.delete(`${TENKAI_API_URL}/valuerules/${ruleId}`);
}

export async function createValueRule(data) {
  return await axios.post(`${TENKAI_API_URL}/valuerules`, data);
}

export async function editValueRule(data) {
  return await axios.post(`${TENKAI_API_URL}/valuerules/edit`, data);
}

export async function allRuleTypes() {
  return [
    { value: 'NotEmpty', label: 'NotEmpty' },
    { value: 'StartsWith', label: 'StartsWith' },
    { value: 'EndsWith', label: 'EndsWith' },
    { value: 'RegEx', label: 'RegEx' }
  ];
}
