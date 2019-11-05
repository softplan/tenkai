import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export async function allProductReleaseServices(productReleaseId) {
  return await axios.get(
    `${TENKAI_API_URL}/productVersionServices?productVersionId=${productReleaseId}`
  );
}

export async function deleteProductReleaseService(productReleaseServiceId) {
  return await axios.delete(
    `${TENKAI_API_URL}/productVersionServices/${productReleaseServiceId}`
  );
}

export async function createProductReleaseService(data) {
  return await axios.post(`${TENKAI_API_URL}/productVersionServices`, data);
}

export async function editProductReleaseService(data) {
  return await axios.post(
    `${TENKAI_API_URL}/productVersionServices/edit`,
    data
  );
}
