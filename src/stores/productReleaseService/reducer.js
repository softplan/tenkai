import * as types from './actionTypes';

const initialState = {
  productReleaseServices: [],
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.ALL_PRODUCT_RELEASE_SERVICE_ERROR:
    case types.DELETE_PRODUCT_RELEASE_SERVICE_ERROR:
    case types.CREATE_PRODUCT_RELEASE_SERVICE_ERROR:
    case types.EDIT_PRODUCT_RELEASE_SERVICE_ERROR:
      return {
        ...state,
        error: action.payload.error
      };

    case types.ALL_PRODUCT_RELEASE_SERVICE_SUCCESS:
    case types.DELETE_PRODUCT_RELEASE_SERVICE_SUCCESS:
    case types.CREATE_PRODUCT_RELEASE_SERVICE_SUCCESS:
    case types.EDIT_PRODUCT_RELEASE_SERVICE_SUCCESS:
      return {
        ...state,
        productReleaseServices: action.payload.productReleaseServices
      };

    default:
      return state;
  }
}

export function getProductReleaseServices(state) {
  return state.productReleaseService.productReleaseServices;
}
