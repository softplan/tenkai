export const LOAD_PRODUCT_CHARTS = 'LOAD_PRODUCT_CHARTS';
export const DEPLOY_SUCCESS = 'DEPLOY_SUCCESS';
export const DEPLOY_ERROR = 'DEPLOY_ERROR';

export const loadProductCharts = data => ({
  type: LOAD_PRODUCT_CHARTS,
  payload: {
    productVersionId: data.productVersionId,
    chartsToDeploy: data.chartsToDeploy
  }
});

export const deploySuccess = () => ({
  type: DEPLOY_SUCCESS
});

export const deployError = error => ({
  type: DEPLOY_ERROR,
  payload: { error }
});
