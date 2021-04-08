const initialState = {};

export default function reduce(state = initialState, action = {}) {
  return state;
}

export function getDeployment(state) {
  return state.deployment;
}
