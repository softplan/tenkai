import axios from 'axios';
import { TENKAI_API_URL } from 'env.js';

export async function load() {
  return await axios.get(`${TENKAI_API_URL}/security-operations`);
}

export async function save(data) {
  return await axios.post(`${TENKAI_API_URL}/security-operations`, data);
}

export async function deleteSecurityOperation(id) {
  return await axios.delete(`${TENKAI_API_URL}/security-operations/${id}`);
}
