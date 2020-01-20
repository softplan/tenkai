export const SELECT_REPOSITORY = 'SELECT_REPOSITORY';
export const SELECT_CHART = 'SELECT_CHART';
export const SELECT_TAG = 'SELECT_TAG';

export const LOAD_REPOS_BEGIN = 'LOAD_REPOS_BEGIN';
export const LOAD_REPOS_SUCCESS = 'LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'LOAD_REPOS_ERROR';

export const LOAD_CHART_BEGIN = 'LOAD_CHART_BEGIN';
export const LOAD_CHART_SUCCESS = 'LOAD_CHART_SUCCESS';
export const LOAD_CHART_ERROR = 'LOAD_CHART_ERROR';

export const LOAD_VARIABLES_BEGIN = 'LOAD_VARIABLES_BEGIN';
export const LOAD_VARIABLES_SUCCESS = 'LOAD_VARIABLES_SUCCESS';
export const LOAD_VARIABLES_ERROR = 'LOAD_VARIABLES_ERROR';

export const LOAD_DOCKER_TAGS_BEGIN = 'LOAD_DOCKER_TAGS_BEGIN';
export const LOAD_DOCKER_TAGS_SUCCESS = 'LOAD_DOCKER_TAGS_SUCCESS';
export const LOAD_DOCKER_TAGS_ERROR = 'LOAD_DOCKER_TAGS_ERROR';

export const SAVE_VARIABLES_BEGIN = 'SAVE_VARIABLES_BEGIN';
export const SAVE_VARIABLES_SUCCESS = 'SAVE_VARIABLES_SUCCESS';
export const SAVE_VARIABLES_ERROR = 'SAVE_VARIABLES_ERROR';

export const INSTALL_BEGIN = 'INSTALL_BEGIN';
export const INSTALL_SUCCESS = 'INSTALL_SUCCESS';
export const INSTALL_ERROR = 'INSTALL_ERROR';

export const selectRepository = selectedRepository => ({
  type: SELECT_REPOSITORY,
  payload: { selectedRepository }
});

export const loadReposBegin = () => ({
  type: LOAD_REPOS_BEGIN
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

export const loadChartsBegin = () => ({
  type: LOAD_CHART_BEGIN
});

export const loadChartsSuccess = charts => ({
  type: LOAD_CHART_SUCCESS,
  payload: { charts }
});

export const loadChartsError = error => ({
  type: LOAD_CHART_ERROR,
  payload: { error }
});

export const loadVariablesBegin = () => ({
  type: LOAD_VARIABLES_BEGIN
});

export const loadVariablesSuccess = variables => ({
  type: LOAD_VARIABLES_SUCCESS,
  payload: { variables }
});

export const loadVariablesError = error => ({
  type: LOAD_VARIABLES_ERROR,
  payload: { error }
});

export const loadDockerTagsBegin = () => ({
  type: LOAD_DOCKER_TAGS_BEGIN
});

export const loadDockerTagsSuccess = dockerTags => ({
  type: LOAD_DOCKER_TAGS_SUCCESS,
  payload: { dockerTags }
});

export const loadDockerTagsError = error => ({
  type: LOAD_DOCKER_TAGS_ERROR,
  payload: { error }
});

export const saveVariablesBegin = () => ({
  type: SAVE_VARIABLES_BEGIN
});

export const saveVariablesSuccess = () => ({
  type: SAVE_VARIABLES_SUCCESS
});

export const saveVariablesError = error => ({
  type: SAVE_VARIABLES_ERROR,
  payload: { error }
});

export const installBegin = () => ({
  type: INSTALL_BEGIN
});

export const installSuccess = () => ({
  type: INSTALL_SUCCESS
});

export const installError = error => ({
  type: INSTALL_ERROR,
  payload: { error }
});
