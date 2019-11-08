import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export async function allUsers() {
  return await axios.get(`${TENKAI_API_URL}/users`);
}

export async function deleteUser(userId) {
  return await axios.delete(`${TENKAI_API_URL}/users/${userId}`);
}

export async function createUser(data) {
  return await axios.post(`${TENKAI_API_URL}/users`, data);
}

export async function editUser(data) {
  return await axios.post(`${TENKAI_API_URL}/users/edit`, data);
}
