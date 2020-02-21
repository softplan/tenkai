import * as types from './actionTypes';

const initialState = {
  productVersionId: null,
  chartsToDeploy: [],
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOAD_PRODUCT_CHARTS:
      return {
        ...state,
        productVersionId: parseInt(action.payload.productVersionId),
        chartsToDeploy: action.payload.chartsToDeploy
      };

    case types.DEPLOY_SUCCESS:
      return state;

    case types.DEPLOY_ERROR:
      return {
        ...state,
        error: action.payload.error
      };

    default:
      return state;
  }
}

export function getDeploy(state) {
  return state.deploy;
}
