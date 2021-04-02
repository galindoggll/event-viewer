import * as types from './actionTypes';

function loadingReducer(state = false, { type }) {
  switch (type) {
    case types.SHOW_LOADER:
      return true;
    case types.HIDE_LOADER:
      return false;
    default:
      return state;
  }
}

export default loadingReducer;
