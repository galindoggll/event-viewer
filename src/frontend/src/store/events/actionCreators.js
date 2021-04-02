import * as types from './actionTypes';

export function actionCreateEvent(userDetails) {
  return {
    type: types.CREATE_EVENT,
    payload: userDetails,
  };
}

export function actionSearchEvent(userList) {
  return {
    type: types.SEARCH_EVENT,
    payload: userList
  };
}

export function actionSetSearchCriteria(keyword, page, limit, sort, sortBy) {
  return {
    type: types.SET_SEARCH_CRITERIA,
    payload: {keyword, page, limit, sort, sortBy},
  };
}

