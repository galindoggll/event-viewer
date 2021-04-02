import * as types from './actionTypes';

const initialState = {
  show: false,
  message: '',
  success: true,
};

function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.SHOW_NOTIFICATION:
      return {
        ...payload,
        show: true,
      };
    case types.HIDE_NOTIFICATION:
      return {
        ...state,
        show: false,
      };
    default:
      return state;
  }
}

export default reducer;
