import Http from 'utils/Http';
import { showLoader, hideLoader } from "store/loader/actionCreators";
import {
  actionCreateUser,
  actionUpdateUser,
  actionDeleteUser,
  actionSearchUser,
  actionClearModalValues,
  actionSetSearchCriteria,
  actionSetModalValues,
} from 'store/users/actionCreators';

export function createUser(userDetails) {
  return dispatch => {
    dispatch(showLoader());

    return Http.post('users', userDetails)
      .then(response => {
        dispatch(actionCreateUser(response.data));
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
}

export function readUser(userId) {
  return dispatch => {
    dispatch(showLoader());

    return Http.get('users/' + userId)
      .then(response => {
        dispatch(actionSetModalValues(response.data.data));
      })
    .catch(error => {
      console.log(error);
      // TODO Handle error throw a snackbar, alert, toast, or something
    })
    .finally(() => {
      dispatch(hideLoader());
    })
  };
}

export function updateUser(userDetails, userId) {
  if (userDetails.avatar.length > 0) {
    userDetails.avatar = userDetails.avatar[0];
  } else {
    delete userDetails.avatar;
  }

  let formData = new FormData();
  for (const [key, value] of Object.entries(userDetails)) {
    formData.append(key, value);
  }

  formData.append('_method', 'PUT');

  return dispatch => {
    dispatch(showLoader());

    return Http.post('users/' + userId, formData, { headers: {'Content-Type': 'multipart/form-data'} })
      .then(response => {
        dispatch(actionUpdateUser(response.data));
      })
      .finally(() => {
        dispatch(hideLoader());
      })
  };
}

export function deleteUser(userIds) {
  return dispatch => {
    dispatch(showLoader());

    if (userIds.length > 1) {
      // TODO Implement here bulk deletion
    } else if (userIds.length === 1) {
      return Http.delete('users/' + userIds[0])
        .then(() => {
          dispatch(actionDeleteUser(userIds));
        })
        .catch(error => {
          console.log(error);
          // TODO Handle error throw a snackbar, alert, toast, or something
        })
        .finally(() => {
          dispatch(hideLoader());
        })
    }
  };
}

export function searchUser(keyword, page, limit, sort, sortBy) {
  return dispatch => {
    dispatch(showLoader());

    return Http.get('users', {params: {keyword, page, limit, sort, sortBy}})
      .then(response => {
        dispatch(actionSearchUser(response.data));
      })
      .catch(error => {
        console.log(error);
        // TODO Handle error throw a snackbar, alert, toast, or something
      })
      .finally(() => {
        dispatch(hideLoader());
      })
  }
}

export function changeSearchCriteria(keyword, page, limit, sort, sortBy) {
  return dispatch => {
    dispatch(actionSetSearchCriteria(keyword, page, limit, sort, sortBy));
  };
}

export function clearModalValues() {
  return dispatch => {
    dispatch(actionClearModalValues());
  };
}
