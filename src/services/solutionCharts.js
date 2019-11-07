import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export async function allSolutionCharts(solutionId) {
  return await axios.get(
    `${TENKAI_API_URL}/solutionCharts?solutionId=${solutionId}`
  );
}

export async function deleteSolutionChart(solutionChartId) {
  return await axios.delete(
    `${TENKAI_API_URL}/solutionCharts/${solutionChartId}`
  );
}

export async function createSolutionChart(data) {
  return await axios.post(`${TENKAI_API_URL}/solutionCharts`, data);
}

export async function editSolutionChart(data) {
  return await axios.post(`${TENKAI_API_URL}/solutionCharts/edit`, data);
}
