import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export async function allSolutions() {
  return await axios.get(`${TENKAI_API_URL}/solutions`);
}

export async function deleteSolution(solutionId) {
  return await axios.delete(`${TENKAI_API_URL}/solutions/${solutionId}`);
}

export async function createSolution(data) {
  return await axios.post(`${TENKAI_API_URL}/solutions`, data);
}

export async function editSolution(data) {
  return await axios.post(`${TENKAI_API_URL}/solutions/edit`, data);
}
