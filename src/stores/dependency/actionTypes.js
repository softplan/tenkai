export const ALL_DEPENDENCY_BEGIN = "dependency.ALL_BEGIN";
export const ALL_DEPENDENCY_SUCCESS = "dependency.ALL_SUCCESS";
export const ALL_DEPENDENCY_ERROR = "dependency.ALL_ERROR";

export const DELETE_DEPENDENCY_BEGIN = "dependency.DELETE_BEGIN";
export const DELETE_DEPENDENCY_SUCCESS = "dependency.DELETE_SUCCESS";
export const DELETE_DEPENDENCY_ERROR = "dependency.DELETE_ERROR";

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
