import * as types from "./actionTypes";

const initialState = {
  productReleaseServices: [],
  loading: false,
  loadingDelete: false,
  loadingSave: false,
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.ALL_PRODUCT_RELEASE_SERVICE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_PRODUCT_RELEASE_SERVICE_BEGIN:
      return {
        loadingDelete: true,
        ...state
      };

    case types.CREATE_PRODUCT_RELEASE_SERVICE_BEGIN:
    case types.EDIT_PRODUCT_RELEASE_SERVICE_BEGIN:
      return {
        ...state,
        loadingSave: true,
        error: null
      };

    case types.ALL_PRODUCT_RELEASE_SERVICE_ERROR:
    case types.DELETE_PRODUCT_RELEASE_SERVICE_ERROR:
    case types.CREATE_PRODUCT_RELEASE_SERVICE_ERROR:
    case types.EDIT_PRODUCT_RELEASE_SERVICE_ERROR:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        error: action.payload.error
      };

    case types.ALL_PRODUCT_RELEASE_SERVICE_SUCCESS:
    case types.DELETE_PRODUCT_RELEASE_SERVICE_SUCCESS:
    case types.CREATE_PRODUCT_RELEASE_SERVICE_SUCCESS:
    case types.EDIT_PRODUCT_RELEASE_SERVICE_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        productReleaseServices: action.payload.productReleaseServices
      };

    default:
      return state;
  }
}

export function getProductReleaseServices(state) {
  return state.productReleaseService.productReleaseServices;
}

export function getLoading(state) {
  return state.productReleaseService.loading;
}

export function getLoadingDelete(state) {
  return state.productReleaseService.loadingDelete;
}

export function getError(state) {
  return state.productReleaseService.error;
}
