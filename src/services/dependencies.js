import axios from "axios";
import TENKAI_API_URL from "env.js";

export async function allDependencies(releaseId) {
  return await axios.get(
    `${TENKAI_API_URL}/dependencies?releaseId=${releaseId}`
  );
}

export async function deleteDependency(dependencieId) {
  return await axios.delete(`${TENKAI_API_URL}/dependencies/${dependencieId}`);
}

export async function saveDependency(data) {
  return await axios.post(`${TENKAI_API_URL}/dependencies`, data);
}

export async function editDependency(data) {
  return await axios.post(`${TENKAI_API_URL}/dependencies/edit`, data);
}
