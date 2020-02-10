import * as types from './actionTypes';

const initialState = {
  productReleases: [],
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.ALL_PRODUCT_RELEASE_ERROR:
    case types.DELETE_PRODUCT_RELEASE_ERROR:
    case types.CREATE_PRODUCT_RELEASE_ERROR:
    case types.EDIT_PRODUCT_RELEASE_ERROR:
    case types.LOCK_PRODUCT_RELEASE_ERROR:
    case types.UNLOCK_PRODUCT_RELEASE_ERROR:
      return {
        ...state,
        error: action.payload.error
      };

    case types.ALL_PRODUCT_RELEASE_SUCCESS:
    case types.DELETE_PRODUCT_RELEASE_SUCCESS:
    case types.CREATE_PRODUCT_RELEASE_SUCCESS:
    case types.EDIT_PRODUCT_RELEASE_SUCCESS:
    case types.LOCK_PRODUCT_RELEASE_SUCCESS:
    case types.UNLOCK_PRODUCT_RELEASE_SUCCESS:
      return {
        ...state,
        productReleases: action.payload.productReleases
      };

    default:
      return state;
  }
}

export function getProductReleases(state) {
  return state.productRelease.productReleases;
}
