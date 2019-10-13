export const ALL_DEPENDENCIES_BEGIN = "dependencies.ALL_BEGIN";
export const ALL_DEPENDENCIES_SUCCESS = "dependencies.ALL_SUCCESS";
export const ALL_DEPENDENCIES_ERROR = "dependencies.ALL_ERROR";

export const allDependenciesBegin = () => ({
  type: ALL_DEPENDENCIES_BEGIN
});

export const allDependenciesSuccess = dependencies => ({
  type: ALL_DEPENDENCIES_SUCCESS,
  payload: { dependencies }
});

export const allDependenciesError = error => ({
  type: ALL_DEPENDENCIES_ERROR,
  payload: { error }
});
