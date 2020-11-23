import * as types from './actionTypes';

const initialState = {
  deployType: '',
  productVersionId: null,
  chartsToDeploy: [],
  selectedEnvironments: [],
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOAD_PRODUCT_CHARTS:
      return {
        ...state,
        productVersionId: parseInt(action.payload.productVersionId),
        chartsToDeploy: action.payload.chartsToDeploy,
        deployType: action.payload.deployType
      };

    case types.LOAD_MULTI_ENV_CHARTS:
      return {
        ...state,
        selectedEnvironments: action.payload.selectedEnvironments,
        chartsToDeploy: action.payload.chartsToDeploy,
        deployType: action.payload.deployType
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
