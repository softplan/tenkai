import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export async function loadRepositories() {
  return await axios.get(`${TENKAI_API_URL}/repositories`);
}

export async function loadCharts(repo, allVersions) {
  return await axios.get(`${TENKAI_API_URL}/charts/${repo}?all=${allVersions}`);
}

export async function loadVariables(envId, chart) {
  return await axios.post(`${TENKAI_API_URL}/listVariables`, {
    environmentId: envId,
    scope: chart
  });
}

export async function loadDockerTags(imageName) {
  return await axios.post(`${TENKAI_API_URL}/listDockerTags`, { imageName });
}

export async function saveVariables(data) {
  return await axios.post(`${TENKAI_API_URL}/saveVariableValues`, { data });
}

export async function install(data) {
  return await axios.post(`${TENKAI_API_URL}/install`, data);
}
