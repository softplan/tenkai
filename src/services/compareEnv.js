import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export async function compareEnvs(data) {
  return await axios.post(`${TENKAI_API_URL}/compare-environments`, data);
}

export async function loadRepositories() {
  return await axios.get(`${TENKAI_API_URL}/repositories`);
}

export async function loadCharts(repo) {
  return await axios.get(`${TENKAI_API_URL}/charts/${repo}?all=false`);
}

export async function loadVariables(envId) {
  return await axios.get(`${TENKAI_API_URL}/variables/${envId}`);
}

export async function loadCustomFilterField() {
  return [
    { value: 'Contains', label: 'Contains' },
    { value: 'StartsWith', label: 'StartsWith' },
    { value: 'EndsWith', label: 'EndsWith' },
    { value: 'RegEx', label: 'RegEx' }
  ];
}

export async function copyVariableValue(data) {
  return await axios.post(`${TENKAI_API_URL}/variables/copy-value`, data);
}

export async function saveCompareEnvQuery(data) {
  return await axios.post(
    `${TENKAI_API_URL}/compare-environments/save-query`,
    data
  );
}

export async function loadCompareEnvQueries() {
  return await axios.get(`${TENKAI_API_URL}/compare-environments/load-queries`);
}

export async function deleteQuery(id) {
  return await axios.delete(
    `${TENKAI_API_URL}/compare-environments/delete-query/${id}`
  );
}
