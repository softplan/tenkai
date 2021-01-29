import axios from 'axios';
import TENKAI_API_URL from 'env.js';

export async function allWebHooks() {
  return await axios.get(`${TENKAI_API_URL}/webhooks`);
}

export async function deleteWebHook(hookId) {
  return await axios.delete(`${TENKAI_API_URL}/webhooks/${hookId}`);
}

export async function createWebHook(data) {
  return await axios.post(`${TENKAI_API_URL}/webhooks`, data);
}

export async function editWebHook(data) {
  return await axios.post(`${TENKAI_API_URL}/webhooks/edit`, data);
}

export async function loadWebhookTypes() {
  return [
    { value: 'HOOK_DEPLOY_PRODUCT', label: 'Deploy Product', useEnv: true },
    { value: 'HOOK_NEW_RELEASE', label: 'New Release', useEnv: false }
  ];
}
