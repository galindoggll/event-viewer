import Http from 'utils/Http';
import { showLoader, hideLoader } from "store/loader/actionCreators";
import {
  actionCreateEvent,
  actionSearchEvent,
  actionSetSearchCriteria,
} from '../store/events/actionCreators';

export function createEvent(eventDetails) {
  return dispatch => {
    dispatch(showLoader());

    return Http.post('events', eventDetails)
      .then(response => {
        dispatch(actionCreateEvent(response.data));
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };
}

export function searchEvent(keyword) {
  return dispatch => {
    dispatch(showLoader());

    return Http.get('events', {params: {keyword}})
      .then(response => {
        dispatch(actionSearchEvent(response.data));
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
