import * as types from './actionTypes';

export function showNotification(message, success = true) {
  return {
    type: types.SHOW_NOTIFICATION,
    payload: {
      message: message,
      success: success,
    },
  };
}

export function hideNotification() {
  return {
    type: types.HIDE_NOTIFICATION,
  };
}
