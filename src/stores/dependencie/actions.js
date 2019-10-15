import * as types from "./actionTypes";
import * as services from "services/dependencies";

export function allDependencies(releaseId) {
  return async dispatch => {
    try {
      dispatch(types.allDependenciesBegin());

      const result = await services.allDependencies(releaseId);
      let dependencies = result.data.dependencies;

      dispatch(types.allDependenciesSuccess(dependencies));
    } catch (error) {
      dispatch(types.allDependenciesError(error));
    }
  };
}
