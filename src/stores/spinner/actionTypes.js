export const INCREASE_LOADING = 'INCREASE_LOADING';
export const DECREASE_LOADING = 'DECREASE_LOADING';

export const showSpinner = () => ({
  type: INCREASE_LOADING
});

export const hideSpinner = () => ({
  type: DECREASE_LOADING
});
