export const SELECT_SOURCE_ENVIRONMENT = 'SELECT_SOURCE_ENVIRONMENT';
export const SELECT_TARGET_ENVIRONMENT = 'SELECT_TARGET_ENVIRONMENT';

export const SELECT_REPOSITORY = 'SELECT_REPOSITORY';
export const INPUT_FILTER = 'INPUT_FILTER';
export const FIELD_FILTER_EXP = 'FIELD_FILTER_EXP';

export const SELECT_FILTER_ONLY_EXCEPT = 'SELECT_FILTER_ONLY_EXCEPT';
export const SELECT_FILTER_ONLY_EXCEPT_FIELD =
  'SELECT_FILTER_ONLY_EXCEPT_FIELD';

export const SELECT_FILTER_FIELD_TYPE = 'SELECT_FILTER_FIELD_TYPE';

export const CLEAR_FILTER = 'CLEAR_FILTER';

export const SHOW_SAVE_DIALOG = 'SHOW_SAVE_DIALOG';
export const CANCEL_SAVE = 'CANCEL_SAVE';
export const INPUT_SAVE_NAME = 'INPUT_SAVE_NAME';
export const SAVE_COMPARE_ENV_QUERY_SUCCESS = 'SAVE_COMPARE_ENV_QUERY_SUCCESS';
export const SAVE_COMPARE_ENV_QUERY_ERROR = 'SAVE_COMPARE_ENV_QUERY_ERROR';
export const LOAD_COMPARE_ENV_QUERIES_SUCCESS =
  'LOAD_COMPARE_ENV_QUERIES_SUCCESS';
export const SET_ENVIRONMENTS = 'SET_ENVIRONMENTS';
export const LOAD_COMPARE_ENV_QUERIES_ERROR = 'LOAD_COMPARE_ENV_QUERIES_ERROR';
export const RENDER_COMPARE_ENV_QUERY = 'RENDER_COMPARE_ENV_QUERY';
export const RENDER_COMPARE_ENV_QUERY_ERROR = 'RENDER_COMPARE_ENV_QUERY_ERROR';

export const ADD_CHART = 'ADD_CHART';
export const REMOVE_CHART = 'REMOVE_CHART';

export const ADD_FIELD = 'ADD_FIELD';
export const REMOVE_FIELD = 'REMOVE_FIELD';

export const ADD_CUSTOM_FIELD = 'ADD_FIELD_CUSTOM';
export const REMOVE_CUSTOM_FIELD = 'REMOVE_CUSTOM_FIELD';

export const COMPARE_ENV_SUCCESS = 'COMPARE_ENV_SUCCESS';
export const COMPARE_ENV_ERROR = 'COMPARE_ENV_ERROR';

export const LOAD_REPOS_SUCCESS = 'LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'LOAD_REPOS_ERROR';

export const LOAD_CHART_SUCCESS = 'LOAD_CHART_SUCCESS';
export const LOAD_CHART_ERROR = 'LOAD_CHART_ERROR';

export const LOAD_SRC_VARIABLES_SUCCESS = 'LOAD_SRC_VARIABLES_SUCCESS';
export const LOAD_SRC_VARIABLES_ERROR = 'LOAD_SRC_VARIABLES_ERROR';

export const LOAD_TAR_VARIABLES_SUCCESS = 'LOAD_TAR_VARIABLES_SUCCESS';
export const LOAD_TAR_VARIABLES_ERROR = 'LOAD_TAR_VARIABLES_ERROR';

export const UPDATE_FIELDS = 'UPDATE_FIELDS';

export const LOAD_FILTER_FIELD_SUCCESS = 'LOAD_FILTER_FIELD_SUCCESS';
export const LOAD_FILTER_FIELD_ERROR = 'LOAD_FILTER_FIELD_ERROR';

export const COPY_TO_LEFT_SUCCESS = 'COPY_TO_LEFT_SUCCESS';
export const COPY_TO_LEFT_ERROR = 'COPY_TO_LEFT_ERROR';

export const COPY_TO_RIGHT_SUCCESS = 'COPY_TO_RIGHT_SUCCESS';
export const COPY_TO_RIGHT_ERROR = 'COPY_TO_RIGHT_ERROR';

export const selectSourceEnvironment = selectedSrcEnv => ({
  type: SELECT_SOURCE_ENVIRONMENT,
  payload: { selectedSrcEnv }
});

export const selectTargetEnvironment = selectedTarEnv => ({
  type: SELECT_TARGET_ENVIRONMENT,
  payload: { selectedTarEnv }
});

export const selectRepository = selectedRepository => ({
  type: SELECT_REPOSITORY,
  payload: { selectedRepository }
});

export const addChart = selectedChart => ({
  type: ADD_CHART,
  payload: { selectedChart }
});

export const removeChart = selectedChart => ({
  type: REMOVE_CHART,
  payload: { selectedChart }
});

export const addField = selectedField => ({
  type: ADD_FIELD,
  payload: { selectedField }
});

export const removeField = selectedField => ({
  type: REMOVE_FIELD,
  payload: { selectedField }
});

export const removeCustomField = customField => ({
  type: REMOVE_CUSTOM_FIELD,
  payload: { customField }
});

export const addCustomField = (filterType, filterValue) => ({
  type: ADD_CUSTOM_FIELD,
  payload: { filterType, filterValue }
});

export const selectFilterOnlyExcept = filterOnlyExceptChart => ({
  type: SELECT_FILTER_ONLY_EXCEPT,
  payload: { filterOnlyExceptChart }
});

export const selectFilterOnlyExceptField = filterOnlyExceptField => ({
  type: SELECT_FILTER_ONLY_EXCEPT_FIELD,
  payload: { filterOnlyExceptField }
});

export const selectFilterFieldType = selectedFilterFieldType => ({
  type: SELECT_FILTER_FIELD_TYPE,
  payload: { selectedFilterFieldType }
});

export const inputFilter = value => ({
  type: INPUT_FILTER,
  payload: { value }
});

export const fieldFilterExp = value => ({
  type: FIELD_FILTER_EXP,
  payload: { value }
});

export const clearFilter = () => ({
  type: CLEAR_FILTER
});

export const showSaveDialog = () => ({
  type: SHOW_SAVE_DIALOG
});

export const cancelSave = () => ({
  type: CANCEL_SAVE
});

export const inputSaveName = value => ({
  type: INPUT_SAVE_NAME,
  payload: { value }
});

export const saveCompareEnvQuerySuccess = data => ({
  type: SAVE_COMPARE_ENV_QUERY_SUCCESS
});

export const saveCompareEnvQueryError = error => ({
  type: SAVE_COMPARE_ENV_QUERY_ERROR,
  payload: { error }
});

export const compareEnvSuccess = envsDiff => ({
  type: COMPARE_ENV_SUCCESS,
  payload: { envsDiff }
});

export const compareEnvError = error => ({
  type: COMPARE_ENV_ERROR,
  payload: { error }
});

export const loadReposSuccess = repositories => ({
  type: LOAD_REPOS_SUCCESS,
  payload: { repositories }
});

export const loadCompareEnvQueriesSuccess = compareEnvQueries => ({
  type: LOAD_COMPARE_ENV_QUERIES_SUCCESS,
  payload: { compareEnvQueries }
});

export const setEnvironments = environments => ({
  type: SET_ENVIRONMENTS,
  payload: { environments }
});

export const loadCompareEnvQueriesError = error => ({
  type: LOAD_COMPARE_ENV_QUERIES_ERROR,
  payload: { error }
});

export const loadReposError = error => ({
  type: LOAD_REPOS_ERROR,
  payload: { error }
});

export const loadChartsSuccess = charts => ({
  type: LOAD_CHART_SUCCESS,
  payload: { charts }
});

export const loadChartsError = error => ({
  type: LOAD_CHART_ERROR,
  payload: { error }
});

export const loadSrcVariablesSuccess = srcVariables => ({
  type: LOAD_SRC_VARIABLES_SUCCESS,
  payload: { srcVariables }
});

export const loadSrcVariablesError = error => ({
  type: LOAD_SRC_VARIABLES_ERROR,
  payload: { error }
});

export const loadTarVariablesSuccess = tarVariables => ({
  type: LOAD_TAR_VARIABLES_SUCCESS,
  payload: { tarVariables }
});

export const renderCompareEnvQuery = compareEnvQuery => ({
  type: RENDER_COMPARE_ENV_QUERY,
  payload: { compareEnvQuery }
});

export const renderCompareEnvQueryError = error => ({
  type: RENDER_COMPARE_ENV_QUERY_ERROR,
  payload: { error }
});

export const loadTarVariablesError = error => ({
  type: LOAD_TAR_VARIABLES_ERROR,
  payload: { error }
});
export const updateFields = fields => ({
  type: UPDATE_FIELDS,
  payload: { fields }
});

export const loadCustomFilterField = filterFields => ({
  type: LOAD_FILTER_FIELD_SUCCESS,
  payload: { filterFields }
});

export const loadCustomFilterFieldError = error => ({
  type: LOAD_FILTER_FIELD_ERROR,
  payload: { error }
});

export const copyToLeftSuccess = () => ({
  type: COPY_TO_LEFT_SUCCESS
});

export const copyToLeftError = error => ({
  type: COPY_TO_LEFT_ERROR,
  payload: { error }
});

export const copyToRightSuccess = () => ({
  type: COPY_TO_RIGHT_SUCCESS
});

export const copyToRightError = error => ({
  type: COPY_TO_RIGHT_ERROR,
  payload: { error }
});
