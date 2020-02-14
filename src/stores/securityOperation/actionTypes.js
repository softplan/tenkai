export const LOAD_SUCCESS = 'LOAD_SUCCESS';
export const LOAD_ERROR = 'LOAD_ERROR';
export const DELETE_SUCCESS = 'DELETE_SUCCESS';
export const DELETE_ERROR = 'DELETE_ERROR';

export const SAVE_SUCCESS = 'SAVE_SUCCESS';
export const SAVE_ERROR = 'SAVE_ERROR';

export const loadSuccess = list => ({
  type: LOAD_SUCCESS,
  payload: { list }
});

export const loadError = error => ({
  type: LOAD_ERROR,
  payload: { error }
});

export const saveError = error => ({
  type: SAVE_ERROR,
  payload: { error }
});

export const saveSuccess = list => ({
  type: SAVE_SUCCESS,
  payload: { list }
});

export const deleteError = error => ({
  type: DELETE_ERROR,
  payload: { error }
});

export const deleteSuccess = id => ({
  type: DELETE_SUCCESS,
  payload: { id }
});
