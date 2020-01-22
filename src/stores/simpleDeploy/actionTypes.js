export const SELECT_REPOSITORY = 'SELECT_REPOSITORY';
export const SELECT_CHART = 'SELECT_CHART';
export const SELECT_TAG = 'SELECT_TAG';
export const SELECT_IMAGE = 'SELECT_IMAGE';

export const LOAD_REPOS_SUCCESS = 'LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'LOAD_REPOS_ERROR';

export const LOAD_CHART_SUCCESS = 'LOAD_CHART_SUCCESS';
export const LOAD_CHART_ERROR = 'LOAD_CHART_ERROR';

export const LOAD_VARIABLES_SUCCESS = 'LOAD_VARIABLES_SUCCESS';
export const LOAD_VARIABLES_ERROR = 'LOAD_VARIABLES_ERROR';

export const LOAD_DOCKER_TAGS_SUCCESS = 'LOAD_DOCKER_TAGS_SUCCESS';
export const LOAD_DOCKER_TAGS_ERROR = 'LOAD_DOCKER_TAGS_ERROR';

export const SAVE_VARIABLES_SUCCESS = 'SAVE_VARIABLES_SUCCESS';
export const SAVE_VARIABLES_ERROR = 'SAVE_VARIABLES_ERROR';

export const INSTALL_SUCCESS = 'INSTALL_SUCCESS';
export const INSTALL_ERROR = 'INSTALL_ERROR';

export const selectRepository = selectedRepository => ({
  type: SELECT_REPOSITORY,
  payload: { selectedRepository }
});

export const loadReposSuccess = repositories => ({
  type: LOAD_REPOS_SUCCESS,
  payload: { repositories }
});

export const loadReposError = error => ({
  type: LOAD_REPOS_ERROR,
  payload: { error }
});

export const selectChart = selectedChart => ({
  type: SELECT_CHART,
  payload: { selectedChart }
});

export const selectTag = selectedTag => ({
  type: SELECT_TAG,
  payload: { selectedTag }
});

export const loadChartsSuccess = charts => ({
  type: LOAD_CHART_SUCCESS,
  payload: { charts }
});

export const loadChartsError = error => ({
  type: LOAD_CHART_ERROR,
  payload: { error }
});

export const loadVariablesSuccess = (variables, image) => ({
  type: LOAD_VARIABLES_SUCCESS,
  payload: { variables, image }
});

export const loadVariablesError = error => ({
  type: LOAD_VARIABLES_ERROR,
  payload: { error }
});

export const loadDockerTagsSuccess = dockerTags => ({
  type: LOAD_DOCKER_TAGS_SUCCESS,
  payload: { dockerTags }
});

export const loadDockerTagsError = error => ({
  type: LOAD_DOCKER_TAGS_ERROR,
  payload: { error }
});

export const saveVariablesSuccess = () => ({
  type: SAVE_VARIABLES_SUCCESS
});

export const saveVariablesError = error => ({
  type: SAVE_VARIABLES_ERROR,
  payload: { error }
});

export const installSuccess = () => ({
  type: INSTALL_SUCCESS
});

export const installError = error => ({
  type: INSTALL_ERROR,
  payload: { error }
});
