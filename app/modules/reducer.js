import advanceSearch from './advanceSearch';
import category from './category';
import keyboardSearch from './keyboardSearch';
import main from './main';
import {combineReducers} from 'redux';

export default combineReducers({
  advanceSearch,
  category,
  keyboardSearch,
  main
});
