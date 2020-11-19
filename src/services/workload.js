import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export default async function getDeploymentRequests(
  startDate,
  endDate,
  envId,
  page,
  sizePerPage
) {
  return await axios.get(
    `${TENKAI_API_URL}/requestDeployments?start_date=${startDate}&end_date=${endDate}&environment_id=${envId}&page=${page}&pageSize=${sizePerPage}`
  );
}
