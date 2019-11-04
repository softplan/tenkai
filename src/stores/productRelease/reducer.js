import * as types from "./actionTypes";

const initialState = {
  productReleases: [],
  loading: false,
  loadingDelete: false,
  loadingSave: false,
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.ALL_PRODUCT_RELEASE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_PRODUCT_RELEASE_BEGIN:
      return {
        loadingDelete: true,
        ...state
      };

    case types.CREATE_PRODUCT_RELEASE_BEGIN:
    case types.EDIT_PRODUCT_RELEASE_BEGIN:
      return {
        ...state,
        loadingSave: true,
        error: null
      };

    case types.ALL_PRODUCT_RELEASE_ERROR:
    case types.DELETE_PRODUCT_RELEASE_ERROR:
    case types.CREATE_PRODUCT_RELEASE_ERROR:
    case types.EDIT_PRODUCT_RELEASE_ERROR:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        error: action.payload.error
      };

    case types.ALL_PRODUCT_RELEASE_SUCCESS:
    case types.DELETE_PRODUCT_RELEASE_SUCCESS:
    case types.CREATE_PRODUCT_RELEASE_SUCCESS:
    case types.EDIT_PRODUCT_RELEASE_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        productReleases: action.payload.productReleases
      };

    default:
      return state;
  }
}

export function getProductReleases(state) {
  return state.productRelease.productReleases;
}

export function getLoading(state) {
  return state.productRelease.loading;
}

export function getLoadingDelete(state) {
  return state.productRelease.loadingDelete;
}

export function getError(state) {
  return state.productRelease.error;
}
