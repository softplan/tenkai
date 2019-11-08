import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export async function allUsers() {
  return await axios.get(`${TENKAI_API_URL}/users`);
}

export async function deleteUser(userId) {
  return await axios.delete(`${TENKAI_API_URL}/users/${userId}`);
}

export async function saveUser(data) {
  return await axios.post(`${TENKAI_API_URL}/users/createOrUpdate`, data);
}
