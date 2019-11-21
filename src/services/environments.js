import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export async function createEnvironment(data) {
  return await axios.post(`${TENKAI_API_URL}/environments`, { data });
}

export async function editEnvironment(data) {
  return await axios.post(`${TENKAI_API_URL}/environments/edit`, { data });
}

export async function allEnvironments() {
  return await axios.get(`${TENKAI_API_URL}/environments`);
}

export async function deleteEnvironment(environmentId) {
  return await axios.delete(
    `${TENKAI_API_URL}/environments/delete/${environmentId}`
  );
}

export async function duplicateEnvironment(environmentId) {
  return await axios.get(
    `${TENKAI_API_URL}/environments/duplicate/${environmentId}`
  );
}

export async function exportEnvironment(environmentId) {
  return await axios.get(
    `${TENKAI_API_URL}/environments/export/${environmentId}`
  );
}
