import * as types from './actionTypes';

export function actionCreateUser(userDetails) {
  return {
    type: types.CREATE_USER,
    payload: userDetails,
  };
}

export function actionUpdateUser(userDetails) {
  return {
    type: types.UPDATE_USER,
    payload: userDetails,
  };
}

export function actionDeleteUser(userId) {
  return {
    type: types.DELETE_USER,
    payload: userId,
  };
}

export function actionSearchUser(userList) {
  return {
    type: types.SEARCH_USER,
    payload: userList
  };
}

export function actionSetSearchCriteria(keyword, page, limit, sort, sortBy) {
  return {
    type: types.SET_SEARCH_CRITERIA,
    payload: {keyword, page, limit, sort, sortBy},
  };
}

export function actionClearModalValues() {
  return {
    type: types.CLEAR_MODAL_VALUES,
  };
}

export function actionSetModalValues(userDetails) {
  return {
    type: types.SET_MODAL_VALUES,
    payload: userDetails,
  };
}
