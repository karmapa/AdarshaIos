import advanceSearch from './advanceSearch';
import keyboardSearch from './keyboardSearch';
import main from './main';
import {combineReducers} from 'redux';

export default combineReducers({
  main,
  advanceSearch,
  keyboardSearch
});
