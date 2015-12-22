import _ from 'lodash';
import Immutable from 'immutable';
import {fetch, filter} from '../helpers';
import wylie from 'tibetan/wylie';

const SET_EXCERPT_DATA = 'SET_EXCERPT_DATA';
const SET_KEYBOARD_SEARCH_LOADING = 'SET_KEYBOARD_SEARCH_LOADING';
const SET_KEYWORD = '';
const SET_SEARCH_ERROR = 'SET_SEARCH_ERROR';
const SET_LOADING_MORE = 'SET_LOADING_MORE';

const initialState = Immutable.Map({
  excerptData: {
    keyword: '',
    rows: [],
    utiSets: [],
    isAppend: false
  },
  keyword: '',
  loading: false,
  searchError: null
});

const actionsMap = {

  [SET_EXCERPT_DATA]: (state, action) => state.set('excerptData', action.data),

  [SET_KEYBOARD_SEARCH_LOADING]: (state, action) => state.set('loading', action.loading),

  [SET_KEYWORD]: (state, action) => state.set('keyword', action.keyword),

  [SET_SEARCH_ERROR]: (state, action) => state.set('searchError', action.err)

};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

let isLoadingMore = false;

export function loadMore(keyword, utiSets) {

  return async (dispatch, getState) => {

    if (isLoadingMore) {
      return;
    }

    isLoadingMore = true;

    let state = getState();
    let excerptData = state.keyboardSearch.get('excerptData');
    let utis = utiSets.shift();

    excerptData.utiSets = utiSets;
    excerptData.rows = await fetch({uti: utis, q: keyword});
    excerptData.isAppend = true;

    dispatch(setExcerptData(excerptData));
    isLoadingMore = false;
  };
}

export function search(keyword) {

  return async dispatch => {

    dispatch(setKeyboardSearchLoading(true));

    if (! keyword) {
      dispatch(setExcerptData({
        keyword,
        rows: [],
        utiSets: [],
        isAppend: false
      }));
      dispatch(setKeyboardSearchLoading(false));
      return;
    }

    if (keyword.match(/^\d+\.\d+[abcd]$/)) {
      let rows = await fetch({uti: keyword}) || [];
      dispatch(setExcerptData({
        keyword,
        rows,
        utiSets: [],
        isAppend: false
      }));
      dispatch(setKeyboardSearchLoading(false));
      return;
    }

    let utiRows = await filter({
      'phrase_sep': '།',
      q: keyword
    });

    let utis = _.pluck(utiRows, 'uti');
    let utiSets = _.chunk(utis, 24);
    let currentUtis = utiSets.shift();

    let rows = await fetch({
      uti: currentUtis,
      q: keyword
    });

    dispatch(setExcerptData({
      keyword,
      rows: rows || [],
      utiSets: utiSets,
      isAppend: false
    }));

    dispatch(setKeyboardSearchLoading(false));
  };
}

export function setExcerptData(data) {
  return {
    type: SET_EXCERPT_DATA,
    data
  };
}

export function setKeyboardSearchLoading(loading) {
  return {
    type: SET_KEYBOARD_SEARCH_LOADING,
    loading
  };
}

export function setKeyword(keyword) {
  return {
    type: SET_KEYWORD,
    keyword
  };
}

export function setSearchError(err) {
  return {
    type: SET_SEARCH_ERROR,
    err
  };
}
