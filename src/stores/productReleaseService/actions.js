import * as types from './actionTypes';
import * as services from 'services/productReleaseService';
import * as global from 'stores/global/actions';

export function allProductReleaseServices(productReleaseId) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      const result = await services.allProductReleaseServices(productReleaseId);
      const productReleaseServices = result.data.list;

      dispatch(
        global.successWithParam(
          types.allProductReleaseServiceSuccess,
          productReleaseServices
        )
      );
    } catch (error) {
      dispatch(global.handleError(error, types.allProductReleaseServiceError));
    }
  };
}

export function deleteProductReleaseService(
  productReleaseServiceId,
  productReleaseId
) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.deleteProductReleaseService(productReleaseServiceId);
      const result = await services.allProductReleaseServices(productReleaseId);
      const productReleaseServices = result.data.list;

      dispatch(
        global.successWithParam(
          types.deleteProductReleaseServiceSuccess,
          productReleaseServices
        )
      );
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(
        global.handleError(error, types.deleteProductReleaseServiceError)
      );
    }
  };
}

export function createProductReleaseService(data, productReleaseId) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.createProductReleaseService(data);
      const result = await services.allProductReleaseServices(productReleaseId);
      const productReleaseServices = result.data.list;

      dispatch(
        global.successWithParam(
          types.createProductReleaseServiceSuccess,
          productReleaseServices
        )
      );
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(
        global.handleError(error, types.createProductReleaseServiceError)
      );
    }
  };
}

export function editProductReleaseService(data, productReleaseId) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.editProductReleaseService(data);
      const result = await services.allProductReleaseServices(productReleaseId);
      const productReleaseServices = result.data.list;

      dispatch(
        global.successWithParam(
          types.editProductReleaseServiceSuccess,
          productReleaseServices
        )
      );
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.editProductReleaseServiceError));
    }
  };
}
