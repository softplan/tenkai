import * as types from "./actionTypes";
import * as services from "services/solutionCharts";

export function allSolutionCharts(solutionId) {
  return async dispatch => {
    try {
      dispatch(types.allSolutionChartBegin());

      const result = await services.allSolutionCharts(solutionId);
      const solutionCharts = result.data.list;

      dispatch(types.allSolutionChartSuccess(solutionCharts));
    } catch (error) {
      dispatch(types.allSolutionChartError(error));
    }
  };
}

export function deleteSolutionChart(solutionChartId, solutionId) {
  return async dispatch => {
    try {
      dispatch(types.deleteSolutionChartBegin());

      await services.deleteSolutionChart(solutionChartId);
      const result = await services.allSolutionCharts(solutionId);
      let solutionCharts = result.data.list;

      dispatch(types.deleteSolutionChartSuccess(solutionCharts));
    } catch (error) {
      dispatch(types.deleteSolutionChartError(error));
    }
  };
}

export function createSolutionChart(data, solutionId) {
  return async dispatch => {
    try {
      dispatch(types.createSolutionChartBegin());

      await services.createSolutionChart(data);
      const result = await services.allSolutionCharts(solutionId);
      const solutionCharts = result.data.list;

      dispatch(types.createSolutionChartSuccess(solutionCharts));
    } catch (error) {
      dispatch(types.createSolutionChartError(error));
    }
  };
}

export function editSolutionChart(data, solutionId) {
  return async dispatch => {
    try {
      dispatch(types.editSolutionChartBegin());

      await services.editSolutionChart(data);
      const result = await services.allSolutionCharts(solutionId);
      const solutionCharts = result.data.list;

      dispatch(types.editSolutionChartSuccess(solutionCharts));
    } catch (error) {
      dispatch(types.editSolutionChartError(error));
    }
  };
}
