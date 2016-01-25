import Immutable from 'immutable';

const SET_HAS_SCROLLED = 'DETAIL_VIEW::SET_HAS_SCROLLED';
const SET_LOADING = 'DETAIL_VIEW::SET_LOADING';
const SET_LOADING_MORE = 'DETAIL_VIEW::SET_LOADING_MORE';
const SET_MATCH_INDEX = 'DETAIL_VIEW::SET_MATCH_INDEX';
const SET_SEARCHBAR_STATUS = 'DETAIL_VIEW::SET_SEARCHBAR_STATUS';
import React, {ListView} from 'react-native';

const SET_KEYWORD = 'DETAIL_VIEW::SET_KEYWORD';
const SET_SEARCH_KEYWORD = 'DETAIL_VIEW::SET_SEARCH_KEYWORD';
const SET_TITLE = 'DETAIL_VIEW::SET_TITLE';
const SET_TOOLBAR_STATUS = 'DETAIL_VIEW::SET_TOOLBAR_STATUS';
const SET_UTIS = 'DETAIL_VIEW::SET_UTIS';
const SET_VISIBLE_UTI = 'DETAIL_VIEW::SET_VISIBLE_UTI';
const SET_DATA_SOURCE = 'DETAIL_VIEW::SET_DATA_SOURCE';

const initialDataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
});

const initialState = Immutable.Map({
  hasScrolled: false,
  isLoading: false,
  isLoadingMore: false,
  matchIndex: 0,
  searchBarOn: false,
  searchKeyword: '',
  title: '',
  toolbarOn: true,
  elements: [],
  utis: [],
  visibleUti: null,
  dataSource: initialDataSource
});

const actionsMap = {

  [SET_KEYWORD]: (state, action) => state.set('keyword', action.keyword),

  [SET_SEARCH_KEYWORD]: (state, action) => state.set('searchKeyword', action.searchKeyword),

  [SET_HAS_SCROLLED]: (state, action) => state.set('hasScrolled', action.hasScrolled),

  [SET_TOOLBAR_STATUS]: (state, action) => state.set('toolbarOn', action.toolbarOn),

  [SET_SEARCHBAR_STATUS]: (state, action) => state.set('searchBarOn', action.searchBarOn),

  [SET_MATCH_INDEX]: (state, action) => state.set('matchIndex', action.matchIndex),

  [SET_UTIS]: (state, action) => state.set('utis', action.utis),

  [SET_LOADING]: (state, action) => state.set('isLoading', action.isLoading),

  [SET_LOADING_MORE]: (state, action) => state.set('isLoadingMore', action.isLoadingMore),

  [SET_TITLE]: (state, action) => state.set('title', action.title),

  [SET_VISIBLE_UTI]: (state, action) => state.set('visibleUti', action.visibleUti),

  [SET_DATA_SOURCE]: (state, action) => state.set('dataSource', action.dataSource)
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

export function setKeyword(keyword) {
  return {
    type: SET_KEYWORD,
    keyword
  };
}

export function setDataSource(dataSource) {
  return {
    type: SET_DATA_SOURCE,
    dataSource
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
    type: SET_LOADING_MORE,
    isLoadingMore
  };
}

export function setLoading(isLoading) {
  return {
    type: SET_LOADING,
    isLoading
  };
}

export function setTitle(title) {
  return {
    type: SET_TITLE,
    title
  };
}

export function setVisibleUti(visibleUti) {
  return {
    type: SET_VISIBLE_UTI,
    visibleUti
  };
}
