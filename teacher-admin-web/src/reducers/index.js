import {combineReducers} from 'redux';
import isJumped from './login/login-reducer';
import errSent from './login/errSent';
import navigator from './menu/left-nav';
import breadcrumb from './menu/breadcrumb';
import authState from './main/authState';
import logout from './logout/logout';
import uri from './common/uri';
import paperInfo from './paper-info';
import stacks from './stacks';
import basicQuiz from './basic-quiz';

const rootReducer = combineReducers({
  uri,
  breadcrumb,
  navigator,
  isJumped,
  errSent,
  authState,
  logout,
  paperInfo,
  stacks,
  basicQuiz
});

export default rootReducer;
