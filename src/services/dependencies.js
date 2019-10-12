import axios from "axios";
import TENKAI_API_URL from "env.js";

export async function allDependencies(releaseId) {
  return await axios.get(
    `${TENKAI_API_URL}/dependencies?releaseId=${releaseId}`
  );
}
