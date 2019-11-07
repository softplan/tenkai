export const ALL_SOLUTION_BEGIN = "solution.ALL_BEGIN";
export const ALL_SOLUTION_SUCCESS = "solution.ALL_SUCCESS";
export const ALL_SOLUTION_ERROR = "solution.ALL_ERROR";

export const DELETE_SOLUTION_BEGIN = "solution.DELETE_BEGIN";
export const DELETE_SOLUTION_SUCCESS = "solution.DELETE_SUCCESS";
export const DELETE_SOLUTION_ERROR = "solution.DELETE_ERROR";

export const CREATE_SOLUTION_BEGIN = "solution.CREATE_BEGIN";
export const CREATE_SOLUTION_SUCCESS = "solution.CREATE_SUCCESS";
export const CREATE_SOLUTION_ERROR = "solution.CREATE_ERROR";

export const EDIT_SOLUTION_BEGIN = "solution.EDIT_BEGIN";
export const EDIT_SOLUTION_SUCCESS = "solution.EDIT_SUCCESS";
export const EDIT_SOLUTION_ERROR = "solution.EDIT_ERROR";

export const allSolutionBegin = () => ({
  type: ALL_SOLUTION_BEGIN
});

export const allSolutionSuccess = solutions => ({
  type: ALL_SOLUTION_SUCCESS,
  payload: { solutions }
});

export const allSolutionError = error => ({
  type: ALL_SOLUTION_ERROR,
  payload: { error }
});

export const createSolutionBegin = () => ({
  type: CREATE_SOLUTION_BEGIN
});

export const createSolutionSuccess = solutions => ({
  type: CREATE_SOLUTION_SUCCESS,
  payload: { solutions }
});

export const createSolutionError = error => ({
  type: CREATE_SOLUTION_ERROR,
  payload: { error }
});

export const editSolutionBegin = () => ({
  type: EDIT_SOLUTION_BEGIN
});

export const editSolutionSuccess = solutions => ({
  type: EDIT_SOLUTION_SUCCESS,
  payload: { solutions }
});

export const editSolutionError = error => ({
  type: EDIT_SOLUTION_ERROR,
  payload: { error }
});

export const deleteSolutionBegin = () => ({
  type: DELETE_SOLUTION_BEGIN
});

export const deleteSolutionSuccess = solutions => ({
  type: DELETE_SOLUTION_SUCCESS,
  payload: { solutions }
});

export const deleteSolutionError = error => ({
  type: DELETE_SOLUTION_ERROR,
  payload: { error }
});
