export const LOAD_PRODUCT_CHARTS = 'LOAD_PRODUCT_CHARTS';
export const DEPLOYMENTSTATUS_SUCCESS = 'DEPLOYMENTSTATUS_SUCCESS';
export const DEPLOYMENTSTATUS_ERROR = 'DEPLOYMENTSTATUS_ERROR';

export const deploymentStatusSuccess = () => ({
  type: DEPLOYMENTSTATUS_SUCCESS
});

export const deploymentStatusError = error => ({
  type: DEPLOYMENTSTATUS_ERROR,
  payload: { error }
});
