import * as types from "./actionTypes";
import * as services from "services/products";

export function allProducts() {
  return async dispatch => {
    try {
      dispatch(types.allProductBegin());

      const result = await services.allProducts();
      const products = result.data.list;

      dispatch(types.allProductSuccess(products));
    } catch (error) {
      dispatch(types.allProductError(error));
    }
  };
}

export function deleteProduct(productId) {
  return async dispatch => {
    try {
      dispatch(types.deleteProductBegin());

      await services.deleteProduct(productId);
      const result = await services.allProducts();
      const products = result.data.list;

      dispatch(types.deleteProductSuccess(products));
    } catch (error) {
      dispatch(types.deleteProductError(error));
    }
  };
}

export function createProduct(data) {
  return async dispatch => {
    try {
      dispatch(types.createProductBegin());

      await services.createProduct(data);
      const result = await services.allProducts();
      const products = result.data.list;

      dispatch(types.createProductSuccess(products));
    } catch (error) {
      dispatch(types.createProductError(error));
    }
  };
}

export function editProduct(data) {
  return async dispatch => {
    try {
      dispatch(types.editProductBegin());

      await services.editProduct(data);
      const result = await services.allProducts();
      const products = result.data.list;

      dispatch(types.editProductSuccess(products));
    } catch (error) {
      dispatch(types.editProductError(error));
    }
  };
}
