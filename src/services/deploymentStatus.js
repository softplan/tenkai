import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export async function deploymentStatus(data) {
  return await axios.get(`${TENKAI_API_URL}/deployments`, data);
}
