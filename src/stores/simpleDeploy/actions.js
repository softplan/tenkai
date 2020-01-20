import * as types from './actionTypes';
import * as services from 'services/simpleDeploy';

export function loadRepositories() {
  return async dispatch => {
    try {
      dispatch(types.loadReposBegin());

      const result = await services.loadRepositories();
      const repositories = result.data.repositories;
      const repos = repositories.map(e => {
        const item = {
          value: e.name,
          label: e.name
        };
        return item;
      });

      dispatch(types.loadReposSuccess(repos));
    } catch (error) {
      dispatch(types.loadReposError(error));
    }
  };
}

export function loadCharts(repo, allVersions) {
  return async dispatch => {
    try {
      dispatch(types.loadChartsBegin());

      const result = await services.loadCharts(repo, allVersions);
      const charts = result.data.charts;
      const repos = charts.map(e => {
        let chartNameVersion = e.name + ' - ' + e.chartVersion;
        const item = {
          value: e.name,
          label: chartNameVersion
        };
        return item;
      });

      dispatch(types.loadChartsSuccess(repos));
    } catch (error) {
      dispatch(types.loadChartsError(error));
    }
  };
}

export function loadVariables(envId, scope, callback) {
  return async dispatch => {
    try {
      dispatch(types.loadVariablesBegin());

      const result = await services.loadVariables(envId, scope);
      const variables = result.data.Variables;
      dispatch(types.loadVariablesSuccess(variables));
      callback();
    } catch (error) {
      dispatch(types.loadVariablesError(error));
    }
  };
}

export function loadDockerTags(imageName) {
  return async dispatch => {
    try {
      dispatch(types.loadDockerTagsBegin());

      const result = await services.loadDockerTags(imageName);
      const dockerTags = result.data.tags;
      const items = dockerTags.map(e => {
        const item = {
          value: e.tag,
          label: e.tag
        };
        return item;
      });

      dispatch(types.loadDockerTagsSuccess(items));
    } catch (error) {
      dispatch(types.loadDockerTagsError(error));
    }
  };
}

export function saveVariables(chartName, dockerTag, environmentId, installCallback) {
  return async dispatch => {
    try {
      dispatch(types.saveVariablesBegin());

      const data = [
        {
          scope: chartName,
          name: 'image.tag',
          value: dockerTag,
          environmentId: environmentId
        }
      ];

      await services.saveVariables(data);
      dispatch(types.saveVariablesSuccess());
      installCallback();
    } catch (error) {
      dispatch(types.saveVariablesError(error));
    }
  };
}

export function install(envId, releaseName, chartName, chartVersion) {
  return async dispatch => {
    try {
      dispatch(types.installBegin());

      const data = {
        environmentId: envId,
        chart: chartName,
        chartVersion: chartVersion,
        name: releaseName
      };

      await services.install(data);
      dispatch(types.installSuccess());
    } catch (error) {
      dispatch(types.installError(error));
    }
  };
}

export function selectRepository(selectedRepository) {
  return async dispatch => {
    dispatch(types.selectRepository(selectedRepository));
  };
}

export function selectChart(selectedChart) {
  return async dispatch => {
    dispatch(types.selectChart(selectedChart));
  };
}

export function selectTag(selectedTag) {
  return async dispatch => {
    dispatch(types.selectTag(selectedTag));
  };
}
