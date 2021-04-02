import * as types from './actionTypes';

const initialState = {
  list: [],
  search: {
    keyword: '',
  },
};

function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.CREATE_EVENT:
      return state;
    case types.SEARCH_EVENT:
      return {
        ...state,
        list: payload.data,
        search: {
          ...state.search,
        },
      };
    case types.SET_SEARCH_CRITERIA:
      return {
        ...state,
        search: {
          ...state.search,
          ...payload,
        },
      };
    default:
      return state;
  }
}

function formulateCurrentPage(currentPage, totalCount, pageSize) {
  let totalPages = Math.ceil(totalCount / pageSize);
  let newCurrentPage = currentPage;

  if (totalPages === 0) {
    // There are no entries, set current page to 1.
    newCurrentPage = 1;
  } else if (totalPages < currentPage) {
    // The current page is out of bounds, return last page instead
    newCurrentPage = totalPages;
  }

  return newCurrentPage;
}

export default reducer;
