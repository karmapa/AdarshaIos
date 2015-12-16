import advanceSearch from './advanceSearch';
import category from './category';
import detailView from './detailView';
import keyboardSearch from './keyboardSearch';
import main from './main';
import {combineReducers} from 'redux';

export default combineReducers({
  advanceSearch,
  category,
  detailView,
  keyboardSearch,
  main
});
