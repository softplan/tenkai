import * as types from "./actionTypes";
import * as services from "services/solutions";

export function allSolutions() {
  return async dispatch => {
    try {
      dispatch(types.allSolutionBegin());

      const result = await services.allSolutions();
      const solutions = result.data.list;

      dispatch(types.allSolutionSuccess(solutions));
    } catch (error) {
      dispatch(types.allSolutionError(error));
    }
  };
}

export function deleteSolution(solutionId) {
  return async dispatch => {
    try {
      dispatch(types.deleteSolutionBegin());

      await services.deleteSolution(solutionId);
      const result = await services.allSolutions();
      const solutions = result.data.list;

      dispatch(types.deleteSolutionSuccess(solutions));
    } catch (error) {
      dispatch(types.deleteSolutionError(error));
    }
  };
}

export function createSolution(data) {
  return async dispatch => {
    try {
      dispatch(types.createSolutionBegin());

      await services.createSolution(data);
      const result = await services.allSolutions();
      const solutions = result.data.list;

      dispatch(types.createSolutionSuccess(solutions));
    } catch (error) {
      dispatch(types.createSolutionError(error));
    }
  };
}

export function editSolution(data) {
  return async dispatch => {
    try {
      dispatch(types.editSolutionBegin());

      await services.editSolution(data);
      const result = await services.allSolutions();
      const solutions = result.data.list;

      dispatch(types.editSolutionSuccess(solutions));
    } catch (error) {
      dispatch(types.editSolutionError(error));
    }
  };
}
