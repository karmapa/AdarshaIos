import Immutable from 'immutable';

const SET_FIRST_SCROLL = 'SET_FIRST_SCROLL';
const SET_TOOLBAR_STATUS = 'SET_TOOLBAR_STATUS';
const SET_SEARCH_KEYWORD = 'SET_SEARCH_KEYWORD';

const initialState = Immutable.Map({
  firstScroll: false,
  toolbarOn: true,
  searchKeyword: ''
});

const actionsMap = {

  [SET_SEARCH_KEYWORD]: (state, action) => state.set('searchKeyword', action.searchKeyword),

  [SET_FIRST_SCROLL]: (state, action) => state.set('firstScroll', action.scrolled),

  [SET_TOOLBAR_STATUS]: (state, action) => state.set('toolbarOn', action.toolbarOn)
};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

export function setFirstScroll(scrolled) {
  return {
    type: SET_FIRST_SCROLL,
    scrolled
  }
}

export function setToolbarStatus(toolbarOn) {
  return {
    type: SET_TOOLBAR_STATUS,
    toolbarOn
  };
}

export function setSearchKeyword(searchKeyword) {
  return {
    type: SET_SEARCH_KEYWORD,
    searchKeyword
  };
}
