import * as types from './actionTypes';

const initialState = {
  products: [],
  error: null
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.ALL_PRODUCT_ERROR:
    case types.DELETE_PRODUCT_ERROR:
    case types.CREATE_PRODUCT_ERROR:
    case types.EDIT_PRODUCT_ERROR:
      return {
        ...state,
        error: action.payload.error
      };

    case types.ALL_PRODUCT_SUCCESS:
    case types.DELETE_PRODUCT_SUCCESS:
    case types.CREATE_PRODUCT_SUCCESS:
    case types.EDIT_PRODUCT_SUCCESS:
      return {
        ...state,
        products: action.payload.products
      };

    default:
      return state;
  }
}

export function getProducts(state) {
  return state.product.products;
}
