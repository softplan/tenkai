export const ALL_PRODUCT_RELEASE_BEGIN = "productRelease.ALL_BEGIN";
export const ALL_PRODUCT_RELEASE_SUCCESS = "productRelease.ALL_SUCCESS";
export const ALL_PRODUCT_RELEASE_ERROR = "productRelease.ALL_ERROR";

export const DELETE_PRODUCT_RELEASE_BEGIN = "productRelease.DELETE_BEGIN";
export const DELETE_PRODUCT_RELEASE_SUCCESS = "productRelease.DELETE_SUCCESS";
export const DELETE_PRODUCT_RELEASE_ERROR = "productRelease.DELETE_ERROR";

export const CREATE_PRODUCT_RELEASE_BEGIN = "productRelease.CREATE_BEGIN";
export const CREATE_PRODUCT_RELEASE_SUCCESS = "productRelease.CREATE_SUCCESS";
export const CREATE_PRODUCT_RELEASE_ERROR = "productRelease.CREATE_ERROR";

export const EDIT_PRODUCT_RELEASE_BEGIN = "productRelease.EDIT_BEGIN";
export const EDIT_PRODUCT_RELEASE_SUCCESS = "productRelease.EDIT_SUCCESS";
export const EDIT_PRODUCT_RELEASE_ERROR = "productRelease.EDIT_ERROR";

export const allProductReleaseBegin = () => ({
  type: ALL_PRODUCT_RELEASE_BEGIN
});

export const allProductReleaseSuccess = productReleases => ({
  type: ALL_PRODUCT_RELEASE_SUCCESS,
  payload: { productReleases }
});

export const allProductReleaseError = error => ({
  type: ALL_PRODUCT_RELEASE_ERROR,
  payload: { error }
});

export const createProductReleaseBegin = () => ({
  type: CREATE_PRODUCT_RELEASE_BEGIN
});

export const createProductReleaseSuccess = productReleases => ({
  type: CREATE_PRODUCT_RELEASE_SUCCESS,
  payload: { productReleases }
});

export const createProductReleaseError = error => ({
  type: CREATE_PRODUCT_RELEASE_ERROR,
  payload: { error }
});

export const editProductReleaseBegin = () => ({
  type: EDIT_PRODUCT_RELEASE_BEGIN
});

export const editProductReleaseSuccess = productReleases => ({
  type: EDIT_PRODUCT_RELEASE_SUCCESS,
  payload: { productReleases }
});

export const editProductReleaseError = error => ({
  type: EDIT_PRODUCT_RELEASE_ERROR,
  payload: { error }
});

export const deleteProductReleaseBegin = () => ({
  type: DELETE_PRODUCT_RELEASE_BEGIN
});

export const deleteProductReleaseSuccess = productReleases => ({
  type: DELETE_PRODUCT_RELEASE_SUCCESS,
  payload: { productReleases }
});

export const deleteProductReleaseError = error => ({
  type: DELETE_PRODUCT_RELEASE_ERROR,
  payload: { error }
});
