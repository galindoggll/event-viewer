import * as types from './actionTypes';

export function authRequestSignIn() {
  return {
    type: types.AUTH_SIGNIN_PENDING,
  };
}

export function authSignIn(authToken) {
  return {
    type: types.AUTH_SIGNIN,
    payload: authToken,
  };
}

export function signOut() {
  return {
    type: types.AUTH_SIGNOUT,
  };
}

export function authFailSignIn(error) {
  return {
    type: types.AUTH_SIGNIN_FAILED,
    payload: error,
  };
}

export function authCheck() {
  return {
    type: types.AUTH_CHECK,
  };
}

export function setUser(user) {
  return {
    type: types.AUTH_SET_USER,
    payload: user,
  };
}
