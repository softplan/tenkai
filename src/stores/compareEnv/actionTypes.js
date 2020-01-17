export const SELECT_SOURCE_ENVIRONMENT = 'SELECT_SOURCE_ENVIRONMENT';
export const SELECT_TARGET_ENVIRONMENT = 'SELECT_TARGET_ENVIRONMENT';

export const COMPARE_ENV_BEGIN = 'COMPARE_ENV_BEGIN';
export const COMPARE_ENV_SUCCESS = 'COMPARE_ENV_SUCCESS';
export const COMPARE_ENV_ERROR = 'COMPARE_ENV_ERROR';

export const LOAD_REPOS_BEGIN = 'LOAD_REPOS_BEGIN';
export const LOAD_REPOS_SUCCESS = 'LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'LOAD_REPOS_ERROR';

export const selectSourceEnvironment = selectedSrcEnv => ({
  type: SELECT_SOURCE_ENVIRONMENT,
  payload: { selectedSrcEnv }
});

export const selectTargetEnvironment = selectedTarEnv => ({
  type: SELECT_TARGET_ENVIRONMENT,
  payload: { selectedTarEnv }
});

export const compareEnvBegin = () => ({
  type: COMPARE_ENV_BEGIN
});

export const compareEnvSuccess = envsDiff => ({
  type: COMPARE_ENV_SUCCESS,
  payload: { envsDiff }
});

export const compareEnvError = error => ({
  type: COMPARE_ENV_ERROR,
  payload: { error }
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
