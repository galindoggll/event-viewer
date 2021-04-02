import * as types from './actionTypes';

const initialState = {
  list: [],
  listMeta: {
    totalCount: 0,
    currentPage: 1,
    lastPage: 1,
    pageSize: 10,
    prevPageUrl: null,
    nextPageUrl: null,
  },
  search: {
    keyword: '',
    limit: 10,
    page: 1,
    sort: 'asc',
    sortBy: 'last_name',
  },
  modalValues: {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    avatar: null,
    status: {
      id: 0,
      name: '',
    },
    password: '',
  },
};

function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.SET_MODAL_VALUES:
      return {
        ...state,
        modalValues: {
          ...state.modalValues,
          id: payload.id ?? state.modalValues.id,
          firstName: payload.first_name ?? state.modalValues.firstName,
          lastName: payload.last_name ?? state.modalValues.lastName,
          email: payload.email ?? state.modalValues.email,
          avatar: payload.avatar ?? state.modalValues.avatar,
          status: payload.status ?? state.modalValues.status,
          password: payload.password ?? state.modalValues.password,
        },
      };
    case types.CREATE_USER:
    case types.UPDATE_USER:
    case types.DELETE_USER:
      return state;
    case types.CLEAR_MODAL_VALUES:
      return {
        ...state,
        modalValues: {
          ...initialState.modalValues,
        },
      };
    case types.SEARCH_USER:
      const currentPage = formulateCurrentPage(payload.meta.currentPage, payload.meta.total, payload.meta.perPage);

      return {
        ...state,
        list: payload.data,
        listMeta: {
          totalCount: payload.meta.total,
          currentPage: currentPage,
          lastPage: payload.meta.lastPage,
          pagSize: payload.meta.perPage,
          prevPageUrl: payload.meta.previousPageUrl,
          nextPageUrl: payload.meta.nextPageUrl,
        },
        search: {
          ...state.search,
          limit: payload.meta.perPage,
          page: currentPage,
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
