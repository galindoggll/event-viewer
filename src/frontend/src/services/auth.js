import Http from 'utils/Http';
import { showLoader, hideLoader } from 'store/loader/actionCreators';
import {
  authRequestSignIn,
  authSignIn,
  authFailSignIn,
  setUser,
  signOut,
} from 'store/auth/actionCreators';

export function signInUser(credentials) {
  return dispatch => {
    /**
     * The app state is updated to inform
     * that the API call is starting.
     */
    dispatch(authRequestSignIn());

    dispatch(showLoader());

    const config = {
      grant_type: 'password',
      client_id: process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
    };

    const data = { ...credentials, ...config };

    // actual api call
    return Http.post('oauth/token', data)
      .then(response => {
        dispatch(authSignIn(response.data));
      })
      .catch(error => {
        // if there are any errors, update the store
        dispatch(authFailSignIn(error.response.data));
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
}

export function signUpUser(formData) {
  return dispatch => {
    return Http.post('register', { ...formData });
  };
}

export function activateUser(token) {
  return dispatch => {
    return Http.post('activate', { token });
  };
}

export function sendForgotPasswordEmail(formData) {
  return dispatch => {
    return Http.post('password/forgot', { ...formData });
  };
}

export function resetPassword(formData) {
  return dispatch => {
    return Http.post('password/reset', { ...formData });
  };
}

export function getUser() {
  return dispatch => {
    return Http.get('profile').then(response => {
      dispatch(setUser(response.data));
    });
  };
}

export function signOutUser() {
  return dispatch => {
    dispatch(showLoader());

    return Http.delete('oauth/token')
      .then(() => {
        dispatch(signOut());
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
}
