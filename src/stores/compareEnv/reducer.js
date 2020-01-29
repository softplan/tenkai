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
  selectedFilterFieldType: {}
};

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case types.CLEAR_FILTER:
      return initialState;

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
        selectedRepository: action.payload.selectedRepository,
        selectedCharts: []
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

    case types.LOAD_CHART_ERROR:
    case types.COMPARE_ENV_ERROR:
    case types.LOAD_REPOS_ERROR:
    case types.LOAD_SRC_VARIABLES_ERROR:
    case types.LOAD_TAR_VARIABLES_ERROR:
    case types.LOAD_FILTER_FIELD_ERROR:
      return {
        ...state,
        envsDiff: action.payload.error
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
