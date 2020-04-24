import axios from 'axios';
import { TENKAI_API_URL } from 'env.js';

export async function allVariableRules() {
  return await axios.get(`${TENKAI_API_URL}/variablerules`);
}

export async function deleteVariableRule(ruleId) {
  return await axios.delete(`${TENKAI_API_URL}/variablerules/${ruleId}`);
}

export async function createVariableRule(data) {
  return await axios.post(`${TENKAI_API_URL}/variablerules`, data);
}

export async function editVariableRule(data) {
  return await axios.post(`${TENKAI_API_URL}/variablerules/edit`, data);
}
