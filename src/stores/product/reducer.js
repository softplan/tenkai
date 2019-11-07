import * as types from "./actionTypes";

const initialState = {
  products: [],
  loading: false,
  loadingDelete: false,
  loadingSave: false,
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.ALL_PRODUCT_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.DELETE_PRODUCT_BEGIN:
      return {
        loadingDelete: true,
        ...state
      };

    case types.CREATE_PRODUCT_BEGIN:
    case types.EDIT_PRODUCT_BEGIN:
      return {
        ...state,
        loadingSave: true,
        error: null
      };

    case types.ALL_PRODUCT_ERROR:
    case types.DELETE_PRODUCT_ERROR:
    case types.CREATE_PRODUCT_ERROR:
    case types.EDIT_PRODUCT_ERROR:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        error: action.payload.error
      };

    case types.ALL_PRODUCT_SUCCESS:
    case types.DELETE_PRODUCT_SUCCESS:
    case types.CREATE_PRODUCT_SUCCESS:
    case types.EDIT_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingDelete: false,
        loadingSave: false,
        products: action.payload.products
      };

    default:
      return state;
  }
}

export function getProducts(state) {
  return state.product.products;
}

export function getLoading(state) {
  return state.product.loading;
}

export function getLoadingDelete(state) {
  return state.product.loadingDelete;
}

export function getError(state) {
  return state.product.error;
}
