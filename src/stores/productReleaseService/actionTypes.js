export const ALL_PRODUCT_RELEASE_SERVICE_BEGIN =
  "productReleaseService.ALL_BEGIN";
export const ALL_PRODUCT_RELEASE_SERVICE_SUCCESS =
  "productReleaseService.ALL_SUCCESS";
export const ALL_PRODUCT_RELEASE_SERVICE_ERROR =
  "productReleaseService.ALL_ERROR";

export const DELETE_PRODUCT_RELEASE_SERVICE_BEGIN =
  "productReleaseService.DELETE_BEGIN";
export const DELETE_PRODUCT_RELEASE_SERVICE_SUCCESS =
  "productReleaseService.DELETE_SUCCESS";
export const DELETE_PRODUCT_RELEASE_SERVICE_ERROR =
  "productReleaseService.DELETE_ERROR";

export const CREATE_PRODUCT_RELEASE_SERVICE_BEGIN =
  "productReleaseService.CREATE_BEGIN";
export const CREATE_PRODUCT_RELEASE_SERVICE_SUCCESS =
  "productReleaseService.CREATE_SUCCESS";
export const CREATE_PRODUCT_RELEASE_SERVICE_ERROR =
  "productReleaseService.CREATE_ERROR";

export const EDIT_PRODUCT_RELEASE_SERVICE_BEGIN =
  "productReleaseService.EDIT_BEGIN";
export const EDIT_PRODUCT_RELEASE_SERVICE_SUCCESS =
  "productReleaseService.EDIT_SUCCESS";
export const EDIT_PRODUCT_RELEASE_SERVICE_ERROR =
  "productReleaseService.EDIT_ERROR";

export const allProductReleaseServiceBegin = () => ({
  type: ALL_PRODUCT_RELEASE_SERVICE_BEGIN
});

export const allProductReleaseServiceSuccess = productReleaseServices => ({
  type: ALL_PRODUCT_RELEASE_SERVICE_SUCCESS,
  payload: { productReleaseServices }
});

export const allProductReleaseServiceError = error => ({
  type: ALL_PRODUCT_RELEASE_SERVICE_ERROR,
  payload: { error }
});

export const createProductReleaseServiceBegin = () => ({
  type: CREATE_PRODUCT_RELEASE_SERVICE_BEGIN
});

export const createProductReleaseServiceSuccess = productReleaseServices => ({
  type: CREATE_PRODUCT_RELEASE_SERVICE_SUCCESS,
  payload: { productReleaseServices }
});

export const createProductReleaseServiceError = error => ({
  type: CREATE_PRODUCT_RELEASE_SERVICE_ERROR,
  payload: { error }
});

export const editProductReleaseServiceBegin = () => ({
  type: EDIT_PRODUCT_RELEASE_SERVICE_BEGIN
});

export const editProductReleaseServiceSuccess = productReleaseServices => ({
  type: EDIT_PRODUCT_RELEASE_SERVICE_SUCCESS,
  payload: { productReleaseServices }
});

export const editProductReleaseServiceError = error => ({
  type: EDIT_PRODUCT_RELEASE_SERVICE_ERROR,
  payload: { error }
});

export const deleteProductReleaseServiceBegin = () => ({
  type: DELETE_PRODUCT_RELEASE_SERVICE_BEGIN
});

export const deleteProductReleaseServiceSuccess = productReleaseServices => ({
  type: DELETE_PRODUCT_RELEASE_SERVICE_SUCCESS,
  payload: { productReleaseServices }
});

export const deleteProductReleaseServiceError = error => ({
  type: DELETE_PRODUCT_RELEASE_SERVICE_ERROR,
  payload: { error }
});
