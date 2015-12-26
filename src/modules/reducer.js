import advanceSearch from './advanceSearch';
import biography from './biography';
import category from './category';
import detailView from './detailView';
import keyboardSearch from './keyboardSearch';
import main from './main';
import {combineReducers} from 'redux';

export default combineReducers({
  advanceSearch,
  biography,
  category,
  detailView,
  keyboardSearch,
  main
});
