const initialState = {};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    default:
      return state;
  }
}

export function getDeployment(state) {
  return state.deployment;
}
