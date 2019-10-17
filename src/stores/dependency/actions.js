import * as types from "./actionTypes";
import * as services from "services/dependencies";

export function allDependencies(releaseId) {
  return async dispatch => {
    try {
      dispatch(types.allDependencyBegin());

      const result = await services.allDependencies(releaseId);
      let dependencies = result.data.dependencies;

      dispatch(types.allDependencySuccess(dependencies));
    } catch (error) {
      dispatch(types.allDependencyError(error));
    }
  };
}

export function deleteDependency(dependencieId, releaseId) {
  return async dispatch => {
    try {
      dispatch(types.deleteDependencyBegin());

      await services.deleteDependency(dependencieId);
      const result = await services.allDependencies(releaseId);
      let dependencies = result.data.dependencies;

      dispatch(types.deleteDependencySuccess(dependencies));
    } catch (error) {
      dispatch(types.deleteDependencyError(error));
    }
  };
}
