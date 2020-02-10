import * as types from './actionTypes';
import * as services from 'services/productRelease';
import * as global from 'stores/global/actions';

export function allProductReleases(productId) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      const result = await services.allProductReleases(productId);
      const productReleases = result.data.list;

      dispatch(
        global.successWithParam(types.allProductReleaseSuccess, productReleases)
      );
    } catch (error) {
      dispatch(global.handleError(error, types.allProductReleaseError));
    }
  };
}

export function deleteProductRelease(productReleaseId, productId) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.deleteProductRelease(productReleaseId);
      const result = await services.allProductReleases(productId);
      let productReleases = result.data.list;

      dispatch(
        global.successWithParam(
          types.deleteProductReleaseSuccess,
          productReleases
        )
      );
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.deleteProductReleaseError));
    }
  };
}

export function createProductRelease(data, productId) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.createProductRelease(data);
      const result = await services.allProductReleases(productId);
      const productReleases = result.data.list;

      dispatch(
        global.successWithParam(
          types.createProductReleaseSuccess,
          productReleases
        )
      );
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.createProductReleaseError));
    }
  };
}

export function editProductRelease(data, productId) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.editProductRelease(data);
      const result = await services.allProductReleases(productId);
      const productReleases = result.data.list;

      dispatch(
        global.successWithParam(
          types.editProductReleaseSuccess,
          productReleases
        )
      );
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.editProductReleaseError));
    }
  };
}

export function lockProductRelease(productReleaseId, productId) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.lockProductRelease(productReleaseId);
      const result = await services.allProductReleases(productId);
      const productReleases = result.data.list;

      dispatch(
        global.successWithParam(
          types.lockProductReleaseSuccess,
          productReleases
        )
      );
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.lockProductReleaseError));
    }
  };
}

export function unlockProductRelease(productReleaseId, productId) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.unlockProductRelease(productReleaseId);
      const result = await services.allProductReleases(productId);
      const productReleases = result.data.list;

      dispatch(
        global.successWithParam(
          types.unlockProductReleaseSuccess,
          productReleases
        )
      );
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.unlockProductReleaseError));
    }
  };
}
