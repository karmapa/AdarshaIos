import Immutable from 'immutable';

const SET_HAS_SCROLLED = 'DETAIL_VIEW::SET_HAS_SCROLLED';
const SET_TOOLBAR_STATUS = 'DETAIL_VIEW::SET_TOOLBAR_STATUS';
const SET_SEARCH_KEYWORD = 'DETAIL_VIEW::SET_SEARCH_KEYWORD';
const SET_SEARCHBAR_STATUS = 'DETAIL_VIEW::SET_SEARCHBAR_STATUS';
const SET_MATCH_INDEX = 'DETAIL_VIEW::SET_MATCH_INDEX';
const SET_UTIS = 'DETAIL_VIEW::SET_UTIS';
const SET_DETAIL_VIEW_LOADING = 'DETAIL_VIEW::SET_DETAIL_VIEW_LOADING';
const SET_DETAIL_VIEW_LOADING_MORE = 'DETAIL_VIEW::SET_DETAIL_VIEW_LOADING_MORE';
const SET_TITLE = 'DETAIL_VIEW::SET_TITLE';

const initialState = Immutable.Map({
  hasScrolled: false,
  isLoading: false,
  isLoadingMore: false,
  matchIndex: 0,
  searchBarOn: false,
  searchKeyword: '',
  title: '',
  toolbarOn: true,
  utis: []
});

const actionsMap = {

  [SET_SEARCH_KEYWORD]: (state, action) => state.set('searchKeyword', action.searchKeyword),

  [SET_HAS_SCROLLED]: (state, action) => state.set('hasScrolled', action.hasScrolled),

  [SET_TOOLBAR_STATUS]: (state, action) => state.set('toolbarOn', action.toolbarOn),

  [SET_SEARCHBAR_STATUS]: (state, action) => state.set('searchBarOn', action.searchBarOn),

  [SET_MATCH_INDEX]: (state, action) => state.set('matchIndex', action.matchIndex),

  [SET_UTIS]: (state, action) => state.set('utis', action.utis),

  [SET_DETAIL_VIEW_LOADING]: (state, action) => state.set('isLoading', action.isLoading),

  [SET_DETAIL_VIEW_LOADING_MORE]: (state, action) => state.set('isLoadingMore', action.isLoadingMore),

  [SET_TITLE]: (state, action) => state.set('title', action.title)
};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

export function setHasScrolled(hasScrolled) {
  return {
    type: SET_HAS_SCROLLED,
    hasScrolled
  };
}

export function setToolbarStatus(toolbarOn) {
  return {
    type: SET_TOOLBAR_STATUS,
    toolbarOn
  };
}

export function setSearchBarStatus(searchBarOn) {
  return {
    type: SET_SEARCHBAR_STATUS,
    searchBarOn
  };
}

export function setSearchKeyword(searchKeyword) {
  return {
    type: SET_SEARCH_KEYWORD,
    searchKeyword
  };
}

export function setMatchIndex(matchIndex) {
  return {
    type: SET_MATCH_INDEX,
    matchIndex
  };
}

export function setUtis(utis) {
  return {
    type: SET_UTIS,
    utis
  };
}

export function setLoadingMore(isLoadingMore) {
  return {
    type: SET_DETAIL_VIEW_LOADING_MORE,
    isLoadingMore
  };
}

export function setLoading(isLoading) {
  return {
    type: SET_DETAIL_VIEW_LOADING,
    isLoading
  };
}

export function setTitle(title) {
  return {
    type: SET_TITLE,
    title
  };
}
