export const ALL_PRODUCT_SUCCESS = 'product.ALL_SUCCESS';
export const ALL_PRODUCT_ERROR = 'product.ALL_ERROR';

export const DELETE_PRODUCT_SUCCESS = 'product.DELETE_SUCCESS';
export const DELETE_PRODUCT_ERROR = 'product.DELETE_ERROR';

export const CREATE_PRODUCT_SUCCESS = 'product.CREATE_SUCCESS';
export const CREATE_PRODUCT_ERROR = 'product.CREATE_ERROR';

export const EDIT_PRODUCT_SUCCESS = 'product.EDIT_SUCCESS';
export const EDIT_PRODUCT_ERROR = 'product.EDIT_ERROR';

export const allProductSuccess = products => ({
  type: ALL_PRODUCT_SUCCESS,
  payload: { products }
});

export const allProductError = error => ({
  type: ALL_PRODUCT_ERROR,
  payload: { error }
});

export const createProductSuccess = products => ({
  type: CREATE_PRODUCT_SUCCESS,
  payload: { products }
});

export const createProductError = error => ({
  type: CREATE_PRODUCT_ERROR,
  payload: { error }
});

export const editProductSuccess = products => ({
  type: EDIT_PRODUCT_SUCCESS,
  payload: { products }
});

export const editProductError = error => ({
  type: EDIT_PRODUCT_ERROR,
  payload: { error }
});

export const deleteProductSuccess = products => ({
  type: DELETE_PRODUCT_SUCCESS,
  payload: { products }
});

export const deleteProductError = error => ({
  type: DELETE_PRODUCT_ERROR,
  payload: { error }
});
