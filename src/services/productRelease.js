import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export async function allProductReleases(productId) {
  return await axios.get(
    `${TENKAI_API_URL}/productVersions?productId=${productId}`
  );
}

export async function deleteProductRelease(productReleaseId) {
  return await axios.delete(
    `${TENKAI_API_URL}/productVersions/${productReleaseId}`
  );
}

export async function createProductRelease(data) {
  return await axios.post(`${TENKAI_API_URL}/productVersions`, data);
}

export async function editProductRelease(data) {
  return await axios.post(`${TENKAI_API_URL}/productVersions/edit`, data);
}
