export const ALL_DEPENDENCY_BEGIN = "dependency.ALL_BEGIN";
export const ALL_DEPENDENCY_SUCCESS = "dependency.ALL_SUCCESS";
export const ALL_DEPENDENCY_ERROR = "dependency.ALL_ERROR";

export const DELETE_DEPENDENCY_BEGIN = "dependency.DELETE_BEGIN";
export const DELETE_DEPENDENCY_SUCCESS = "dependency.DELETE_SUCCESS";
export const DELETE_DEPENDENCY_ERROR = "dependency.DELETE_ERROR";

export const CREATE_DEPENDENCY_BEGIN = "dependency.CREATE_BEGIN";
export const CREATE_DEPENDENCY_SUCCESS = "dependency.CREATE_SUCCESS";
export const CREATE_DEPENDENCY_ERROR = "dependency.CREATE_ERROR";

export const EDIT_DEPENDENCY_BEGIN = "dependency.EDIT_BEGIN";
export const EDIT_DEPENDENCY_SUCCESS = "dependency.EDIT_SUCCESS";
export const EDIT_DEPENDENCY_ERROR = "dependency.EDIT_ERROR";

export const allDependencyBegin = () => ({
  type: ALL_DEPENDENCY_BEGIN
});

export const allDependencySuccess = dependencies => ({
  type: ALL_DEPENDENCY_SUCCESS,
  payload: { dependencies }
});

export const allDependencyError = error => ({
  type: ALL_DEPENDENCY_ERROR,
  payload: { error }
});

export const createDependencyBegin = () => ({
  type: CREATE_DEPENDENCY_BEGIN
});

export const createDependencySuccess = dependencies => ({
  type: CREATE_DEPENDENCY_SUCCESS,
  payload: { dependencies }
});

export const createDependencyError = error => ({
  type: CREATE_DEPENDENCY_ERROR,
  payload: { error }
});

export const editDependencyBegin = () => ({
  type: EDIT_DEPENDENCY_BEGIN
});

export const editDependencySuccess = dependencies => ({
  type: EDIT_DEPENDENCY_SUCCESS,
  payload: { dependencies }
});

export const editDependencyError = error => ({
  type: EDIT_DEPENDENCY_ERROR,
  payload: { error }
});

export const deleteDependencyBegin = () => ({
  type: DELETE_DEPENDENCY_BEGIN
});

export const deleteDependencySuccess = dependencies => ({
  type: DELETE_DEPENDENCY_SUCCESS,
  payload: { dependencies }
});

export const deleteDependencyError = error => ({
  type: DELETE_DEPENDENCY_ERROR,
  payload: { error }
});
