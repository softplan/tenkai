import * as types from "./actionTypes";
import * as services from "services/productReleaseService";

export function allProductReleaseServices(productReleaseId) {
  return async dispatch => {
    try {
      dispatch(types.allProductReleaseServiceBegin());

      const result = await services.allProductReleaseServices(productReleaseId);
      const productReleaseServices = result.data.list;

      dispatch(types.allProductReleaseServiceSuccess(productReleaseServices));
    } catch (error) {
      dispatch(types.allProductReleaseServiceError(error));
    }
  };
}

export function deleteProductReleaseService(
  productReleaseServiceId,
  productReleaseId
) {
  return async dispatch => {
    try {
      dispatch(types.deleteProductReleaseServiceBegin());

      await services.deleteProductReleaseService(productReleaseServiceId);
      const result = await services.allProductReleaseServices(productReleaseId);
      const productReleaseServices = result.data.list;

      dispatch(
        types.deleteProductReleaseServiceSuccess(productReleaseServices)
      );
    } catch (error) {
      dispatch(types.deleteProductReleaseServiceError(error));
    }
  };
}

export function createProductReleaseService(data, productReleaseId) {
  return async dispatch => {
    try {
      dispatch(types.createProductReleaseServiceBegin());

      await services.createProductReleaseService(data);
      const result = await services.allProductReleaseServices(productReleaseId);
      const productReleaseServices = result.data.list;

      dispatch(
        types.createProductReleaseServiceSuccess(productReleaseServices)
      );
    } catch (error) {
      dispatch(types.createProductReleaseServiceError(error));
    }
  };
}

export function editProductReleaseService(data, productReleaseId) {
  return async dispatch => {
    try {
      dispatch(types.editProductReleaseServiceBegin());

      await services.editProductReleaseService(data);
      const result = await services.allProductReleaseServices(productReleaseId);
      const productReleaseServices = result.data.list;

      dispatch(types.editProductReleaseServiceSuccess(productReleaseServices));
    } catch (error) {
      dispatch(types.editProductReleaseServiceError(error));
    }
  };
}
