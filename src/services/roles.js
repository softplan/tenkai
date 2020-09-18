import axios from 'axios';
import { TENKAI_API_URL } from 'env.js';

export async function save(data) {
  return await axios.post(
    `${TENKAI_API_URL}/createOrUpdateUserEnvironmentRole`,
    data
  );
}

export async function getUserPolicyByEnvironment(data) {
  return await axios.post(`${TENKAI_API_URL}/getUserPolicyByEnvironment`, data);
}
