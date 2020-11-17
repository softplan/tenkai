import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export default async function getDeploymentRequests(
  startDate,
  endDate,
  envId,
  userId,
  page,
  sizePerPage
) {
  if (userId) {
    return await axios.get(
      `${TENKAI_API_URL}/deployments?start_date=${startDate}&end_date=${endDate}&environment_id=${envId}&user_id=${userId}&page=${page}&pageSize=${sizePerPage}`
    );
  }
  return await axios.get(
    `${TENKAI_API_URL}/deployments?start_date=${startDate}&end_date=${endDate}&environment_id=${envId}&page=${page}&pageSize=${sizePerPage}`
  );
}
