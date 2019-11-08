import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export async function allProducts() {
  return await axios.get(`${TENKAI_API_URL}/products`);
}

export async function deleteProduct(productId) {
  return await axios.delete(`${TENKAI_API_URL}/products/${productId}`);
}

export async function createProduct(data) {
  return await axios.post(`${TENKAI_API_URL}/products`, data);
}

export async function editProduct(data) {
  return await axios.post(`${TENKAI_API_URL}/products/edit`, data);
}
