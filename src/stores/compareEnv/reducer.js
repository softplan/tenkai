import * as types from './actionTypes';

const initialState = {
  error: null,
  envsDiff: [],
  repositories: [],
  charts: [],
  selectedRepository: {},
  selectedCharts: [],
  selectedFields: [],
  customFields: [],
  filterOnlyExceptChart: 0,
  filterOnlyExceptField: 0,
  selectedSrcEnv: null,
  selectedTarEnv: null,
  srcVariables: [],
  tarVariables: [],
  fields: [],
  inputFilter: '',
  selectedFilterFieldType: {},
  showSaveAsDialog: false,
  showDeleteDialog: false,
  showSaveDialog: false,
  compareEnvQueryName: '',
  compareEnvQueries: [],
  environments: [],
  selectedCompareEnvQuery: {}
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.CLEAR_FILTER:
      return {
        ...state,
        error: null,
        envsDiff: [],
        selectedRepository: {},
        selectedCharts: [],
        selectedFields: [],
        customFields: [],
        filterOnlyExceptChart: 0,
        filterOnlyExceptField: 0,
        selectedSrcEnv: null,
        selectedTarEnv: null,
        srcVariables: [],
        tarVariables: [],
        inputFilter: '',
        selectedFilterFieldType: {},
        showSaveAsDialog: false,
        showSaveDialog: false,
        compareEnvQueryName: '',
        selectedCompareEnvQuery: {}
      };

    case types.INPUT_FILTER:
      return {
        ...state,
        inputFilter: action.payload.value
      };

    case types.FIELD_FILTER_EXP:
      return {
        ...state,
        fieldFilterExp: action.payload.value
      };

    case types.SELECT_REPOSITORY:
      return {
        ...state,
        selectedRepository: action.payload.selectedRepository
      };

    case types.ADD_CHART:
      if (!arrayHasValue(state.selectedCharts, action.payload.selectedChart)) {
        return {
          ...state,
          selectedCharts: [
            ...state.selectedCharts,
            action.payload.selectedChart
          ]
        };
      }
      return state;

    case types.REMOVE_CHART:
      return {
        ...state,
        selectedCharts: state.selectedCharts.filter(
          i => i !== action.payload.selectedChart
        )
      };

    case types.ADD_FIELD:
      if (!arrayHasValue(state.selectedFields, action.payload.selectedField)) {
        return {
          ...state,
          selectedFields: [
            ...state.selectedFields,
            action.payload.selectedField
          ]
        };
      }
      return state;

    case types.ADD_CUSTOM_FIELD:
      return {
        ...state,
        customFields: [...state.customFields, action.payload]
      };

    case types.REMOVE_FIELD:
      return {
        ...state,
        selectedFields: state.selectedFields.filter(
          i => i !== action.payload.selectedField
        )
      };

    case types.REMOVE_CUSTOM_FIELD:
      return {
        ...state,
        customFields: state.customFields.filter(
          i =>
            !(
              i.filterType === action.payload.customField.filterType &&
              i.filterValue === action.payload.customField.filterValue
            )
        )
      };

    case types.SELECT_FILTER_ONLY_EXCEPT:
      return {
        ...state,
        filterOnlyExceptChart: action.payload.filterOnlyExceptChart
      };

    case types.SELECT_FILTER_ONLY_EXCEPT_FIELD:
      return {
        ...state,
        filterOnlyExceptField: action.payload.filterOnlyExceptField
      };

    case types.SELECT_SOURCE_ENVIRONMENT:
      return {
        ...state,
        selectedSrcEnv: action.payload.selectedSrcEnv
      };

    case types.SELECT_TARGET_ENVIRONMENT:
      return {
        ...state,
        selectedTarEnv: action.payload.selectedTarEnv
      };

    case types.SELECT_FILTER_FIELD_TYPE:
      return {
        ...state,
        selectedFilterFieldType: action.payload.selectedFilterFieldType
      };

    case types.SHOW_SAVE_AS_DIALOG:
      return {
        ...state,
        showSaveAsDialog: true
      };

    case types.SHOW_DELETE_DIALOG:
      return {
        ...state,
        showDeleteDialog: true
      };

    case types.CANCEL_SAVE_AS:
      return {
        ...state,
        showSaveAsDialog: false,
        compareEnvQueryName: ''
      };

    case types.SHOW_SAVE_DIALOG:
      return {
        ...state,
        showSaveDialog: true
      };

    case types.CANCEL_SAVE:
      return {
        ...state,
        showSaveDialog: false,
        compareEnvQueryName: ''
      };

    case types.DELETE_QUERY_CANCEL:
      return {
        ...state,
        showDeleteDialog: false
      };

    case types.INPUT_SAVE_NAME:
      return {
        ...state,
        compareEnvQueryName: action.payload.value
      };

    case types.COMPARE_ENV_SUCCESS:
      return {
        ...state,
        envsDiff: action.payload.envsDiff
      };

    case types.LOAD_REPOS_SUCCESS:
      const newState = {
        ...state,
        repositories: action.payload.repositories
      };
      console.log(newState);
      return newState;

    case types.LOAD_CHART_SUCCESS:
      return {
        ...state,
        charts: action.payload.charts
      };

    case types.LOAD_SRC_VARIABLES_SUCCESS:
      return {
        ...state,
        srcVariables: action.payload.srcVariables
      };

    case types.LOAD_TAR_VARIABLES_SUCCESS:
      return {
        ...state,
        tarVariables: action.payload.tarVariables
      };

    case types.LOAD_FILTER_FIELD_SUCCESS:
      return {
        ...state,
        filterFields: action.payload.filterFields
      };

    case types.COPY_TO_LEFT_SUCCESS:
    case types.COPY_TO_RIGHT_SUCCESS:
      return state;

    case types.SAVE_COMPARE_ENV_QUERY_SUCCESS:
      return {
        ...state,
        showSaveAsDialog: false,
        showSaveDialog: false,
        compareEnvQueryName: ''
      };

    case types.LOAD_COMPARE_ENV_QUERIES_SUCCESS:
      return {
        ...state,
        compareEnvQueries: action.payload.compareEnvQueries
      };

    case types.DELETE_COMPARE_ENV_QUERY_SUCCESS:
      return {
        ...state,
        selectedCompareEnvQuery: {},
        showDeleteDialog: false
      };

    case types.UPDATE_FIELDS:
      let uniqueFields = [];

      action.payload.fields.forEach(field => {
        if (
          !arrayHasElement(state.fields, field) &&
          !arrayHasElement(uniqueFields, field)
        ) {
          uniqueFields.push(field);
        }
      });

      const oldFields = state.fields;
      let newFields = oldFields.concat(uniqueFields);
      newFields.sort(sort);

      return {
        ...state,
        fields: newFields
      };

    case types.SET_ENVIRONMENTS:
      return {
        ...state,
        environments: action.payload.environments
      };

    case types.RENDER_COMPARE_ENV_QUERY:
      const query = action.payload.compareEnvQuery.value.query;
      const envs = state.environments;

      return {
        ...state,
        selectedCompareEnvQuery: action.payload.compareEnvQuery,
        selectedSrcEnv: envs.find(e => e.value === query.sourceEnvId),
        selectedTarEnv: envs.find(e => e.value === query.targetEnvId),
        filterOnlyExceptChart: query.filterOnlyExceptChart,
        selectedCharts: getSelectedCharts(query),
        filterOnlyExceptField: query.filterOnlyExceptField,
        selectedFields: getSelectedFields(query),
        customFields: query.customFields,
        selectedFilterFieldType: query.selectedFilterFieldType,
        inputFilter: query.globalFilter
      };

    case types.UPDATE_SELECTED_COMPARE_ENV_QUERY:
      const updated = state.compareEnvQueries.find(
        q => q.value.id === state.selectedCompareEnvQuery.value.id
      );
      return {
        ...state,
        selectedCompareEnvQuery: updated
      };

    case types.LOAD_CHART_ERROR:
    case types.COMPARE_ENV_ERROR:
    case types.LOAD_REPOS_ERROR:
    case types.LOAD_SRC_VARIABLES_ERROR:
    case types.LOAD_TAR_VARIABLES_ERROR:
    case types.LOAD_FILTER_FIELD_ERROR:
    case types.COPY_TO_LEFT_ERROR:
    case types.COPY_TO_RIGHT_ERROR:
    case types.SAVE_COMPARE_ENV_QUERY_ERROR:
    case types.LOAD_COMPARE_ENV_QUERIES_ERROR:
    case types.RENDER_COMPARE_ENV_QUERY_ERROR:
      return {
        ...state,
        envsDiff: action.payload.error
      };

    case types.DELETE_COMPARE_ENV_QUERY_ERROR:
      return {
        ...state,
        envsDiff: action.payload.error,
        showDeleteDialog: false
      };

    default:
      return state;
  }
}

export function getError(state) {
  return state.error;
}

export function getCompareEnv(state) {
  return state.compareEnv;
}

function arrayHasElement(array, element) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].value === element.value) {
      return true;
    }
  }
  return false;
}

function arrayHasValue(array, element) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === element) {
      return true;
    }
  }
  return false;
}

function sort(a, b) {
  const fieldA = a.value.toUpperCase();
  const fieldB = b.value.toUpperCase();

  if (fieldA > fieldB) {
    return 1;
  }
  if (fieldA < fieldB) {
    return -1;
  }
  return 0;
}

function getSelectedCharts(query) {
  let selectedCharts = [];
  if (query.filterOnlyExceptChart === 1) {
    selectedCharts = query.onlyCharts;
  } else if (query.filterOnlyExceptChart === 2) {
    selectedCharts = query.exceptCharts;
  }
  return selectedCharts;
}

function getSelectedFields(query) {
  let selectedFields = [];
  if (query.filterOnlyExceptField === 1) {
    selectedFields = query.onlyFields;
  } else if (query.filterOnlyExceptField === 2) {
    selectedFields = query.exceptFields;
  }
  return selectedFields;
}
