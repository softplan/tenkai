export const INCREASE_LOADING = 'INCREASE_LOADING';
export const DECREASE_LOADING = 'DECREASE_LOADING';

export const show = () => ({
  type: INCREASE_LOADING
});

export const hide = () => ({
  type: DECREASE_LOADING
});
