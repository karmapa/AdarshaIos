import * as types from '../actions/mainActions';
import Immutable from 'immutable';

const initialState = Immutable.Map({
  selectedTab: 'keyboardSearch'
});

const actionsMap = {
  [types.SET_SELECTED_TAB]: setSelectedTab
};

export default function main(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

function setSelectedTab(state, action) {
  return state.set('selectedTab', action.selectedTab);
}
