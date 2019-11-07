export const ALL_SOLUTION_CHART_BEGIN = "solutionChart.ALL_BEGIN";
export const ALL_SOLUTION_CHART_SUCCESS = "solutionChart.ALL_SUCCESS";
export const ALL_SOLUTION_CHART_ERROR = "solutionChart.ALL_ERROR";

export const DELETE_SOLUTION_CHART_BEGIN = "solutionChart.DELETE_BEGIN";
export const DELETE_SOLUTION_CHART_SUCCESS = "solutionChart.DELETE_SUCCESS";
export const DELETE_SOLUTION_CHART_ERROR = "solutionChart.DELETE_ERROR";

export const CREATE_SOLUTION_CHART_BEGIN = "solutionChart.CREATE_BEGIN";
export const CREATE_SOLUTION_CHART_SUCCESS = "solutionChart.CREATE_SUCCESS";
export const CREATE_SOLUTION_CHART_ERROR = "solutionChart.CREATE_ERROR";

export const EDIT_SOLUTION_CHART_BEGIN = "solutionChart.EDIT_BEGIN";
export const EDIT_SOLUTION_CHART_SUCCESS = "solutionChart.EDIT_SUCCESS";
export const EDIT_SOLUTION_CHART_ERROR = "solutionChart.EDIT_ERROR";

export const allSolutionChartBegin = () => ({
  type: ALL_SOLUTION_CHART_BEGIN
});

export const allSolutionChartSuccess = solutionCharts => ({
  type: ALL_SOLUTION_CHART_SUCCESS,
  payload: { solutionCharts }
});

export const allSolutionChartError = error => ({
  type: ALL_SOLUTION_CHART_ERROR,
  payload: { error }
});

export const createSolutionChartBegin = () => ({
  type: CREATE_SOLUTION_CHART_BEGIN
});

export const createSolutionChartSuccess = solutionCharts => ({
  type: CREATE_SOLUTION_CHART_SUCCESS,
  payload: { solutionCharts }
});

export const createSolutionChartError = error => ({
  type: CREATE_SOLUTION_CHART_ERROR,
  payload: { error }
});

export const editSolutionChartBegin = () => ({
  type: EDIT_SOLUTION_CHART_BEGIN
});

export const editSolutionChartSuccess = solutionCharts => ({
  type: EDIT_SOLUTION_CHART_SUCCESS,
  payload: { solutionCharts }
});

export const editSolutionChartError = error => ({
  type: EDIT_SOLUTION_CHART_ERROR,
  payload: { error }
});

export const deleteSolutionChartBegin = () => ({
  type: DELETE_SOLUTION_CHART_BEGIN
});

export const deleteSolutionChartSuccess = solutionCharts => ({
  type: DELETE_SOLUTION_CHART_SUCCESS,
  payload: { solutionCharts }
});

export const deleteSolutionChartError = error => ({
  type: DELETE_SOLUTION_CHART_ERROR,
  payload: { error }
});
