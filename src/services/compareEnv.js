import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export async function compareEnvs(data) {
  return await axios.post(`${TENKAI_API_URL}/compare-environments`, data);
}
