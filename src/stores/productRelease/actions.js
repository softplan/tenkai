import * as types from "./actionTypes";
import * as services from "services/productRelease";

export function allProductReleases(productId) {
  return async dispatch => {
    try {
      dispatch(types.allProductReleaseBegin());

      const result = await services.allProductReleases(productId);
      const productReleases = result.data.list;

      dispatch(types.allProductReleaseSuccess(productReleases));
    } catch (error) {
      dispatch(types.allProductReleaseError(error));
    }
  };
}

export function deleteProductRelease(productReleaseId, productId) {
  return async dispatch => {
    try {
      dispatch(types.deleteProductReleaseBegin());

      await services.deleteProductRelease(productReleaseId);
      const result = await services.allProductReleases(productId);
      let productReleases = result.data.list;

      dispatch(types.deleteProductReleaseSuccess(productReleases));
    } catch (error) {
      dispatch(types.deleteProductReleaseError(error));
    }
  };
}

export function createProductRelease(data, productId) {
  return async dispatch => {
    try {
      dispatch(types.createProductReleaseBegin());

      await services.createProductRelease(data);
      const result = await services.allProductReleases(productId);
      const productReleases = result.data.list;

      dispatch(types.createProductReleaseSuccess(productReleases));
    } catch (error) {
      dispatch(types.createProductReleaseError(error));
    }
  };
}

export function editProductRelease(data, productId) {
  return async dispatch => {
    try {
      dispatch(types.editProductReleaseBegin());

      await services.editProductRelease(data);
      const result = await services.allProductReleases(productId);
      const productReleases = result.data.list;

      dispatch(types.editProductReleaseSuccess(productReleases));
    } catch (error) {
      dispatch(types.editProductReleaseError(error));
    }
  };
}

export function lockProductRelease(productReleaseId, productId) {
  return async dispatch => {
    try {
      dispatch(types.lockProductReleaseBegin());

      await services.lockProductRelease(productReleaseId);
      const result = await services.allProductReleases(productId);
      const productReleases = result.data.list;

      dispatch(types.lockProductReleaseSuccess(productReleases));
    } catch (error) {
      dispatch(types.lockProductReleaseError(error));
    }
  };
}

export function unlockProductRelease(productReleaseId, productId) {
  return async dispatch => {
    try {
      dispatch(types.unlockProductReleaseBegin());

      await services.unlockProductRelease(productReleaseId);
      const result = await services.allProductReleases(productId);
      const productReleases = result.data.list;

      dispatch(types.unlockProductReleaseSuccess(productReleases));
    } catch (error) {
      dispatch(types.unlockProductReleaseError(error));
    }
  };
}

