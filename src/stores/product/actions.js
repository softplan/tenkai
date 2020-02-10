import * as types from './actionTypes';
import * as services from 'services/products';
import * as global from 'stores/global/actions';

export function allProducts() {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      const result = await services.allProducts();
      const products = result.data.list;

      dispatch(global.successWithParam(types.allProductSuccess, products));
    } catch (error) {
      dispatch(global.handleError(error, types.allProductError));
    }
  };
}

export function deleteProduct(productId) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.deleteProduct(productId);
      const result = await services.allProducts();
      const products = result.data.list;

      dispatch(global.successWithParam(types.deleteProductSuccess, products));
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.deleteProductError));
    }
  };
}

export function createProduct(data) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.createProduct(data);
      const result = await services.allProducts();
      const products = result.data.list;

      dispatch(global.successWithParam(types.createProductSuccess, products));
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.createProductError));
    }
  };
}

export function editProduct(data) {
  return async dispatch => {
    try {
      dispatch(global.beginLoad());

      await services.editProduct(data);
      const result = await services.allProducts();
      const products = result.data.list;

      dispatch(global.successWithParam(types.editProductSuccess, products));
      dispatch(global.successDefaultMessage());
    } catch (error) {
      dispatch(global.handleError(error, types.editProductError));
    }
  };
}
