export const LOAD_PRODUCT_CHARTS = 'LOAD_PRODUCT_CHARTS';
export const LOAD_MULTI_ENV_CHARTS = 'LOAD_MULTI_ENV_CHARTS';
export const DEPLOY_SUCCESS = 'DEPLOY_SUCCESS';
export const DEPLOY_ERROR = 'DEPLOY_ERROR';

export const loadProductCharts = data => ({
  type: LOAD_PRODUCT_CHARTS,
  payload: {
    deployType: 'PRODUCT',
    productVersionId: data.productVersionId,
    chartsToDeploy: data.chartsToDeploy
  }
});

export const loadMultiEnvDeployWithoutProduct = data => ({
  type: LOAD_MULTI_ENV_CHARTS,
  payload: {
    deployType: 'MULTI_ENV',
    selectedEnvironments: data.selectedEnvironments,
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
