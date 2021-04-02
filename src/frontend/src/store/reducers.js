import { combineReducers } from 'redux';
import auth from './auth/reducer';
import loader from './loader/reducer';
import notification from './notification/reducer';
import users from './users/reducer';
import events from './events/reducer';

const reducers = combineReducers({
  auth,
  loader,
  notification,
  users,
  events,
});

export default reducers;
