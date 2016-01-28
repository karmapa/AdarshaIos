import _ from 'lodash';
import Immutable from 'immutable';
import {fetch, filter, isPbId} from '../helpers';

const SET_EXCERPT_DATA = 'KEYBOARD_SEARCH::SET_EXCERPT_DATA';
const SET_LOADING = 'KEYBOARD_SEARCH::SET_LOADING';
const SET_LOADING_MORE = 'KEYBOARD_SEARCH::SET_LOADING_MORE';
const SET_KEYWORD = 'KEYBOARD_SEARCH::SET_KEYWORD';
const SET_SEARCH_ERROR = 'KEYBOARD_SEARCH::SET_SEARCH_ERROR';

const CHUNK_SIZE = 14;

const initialState = Immutable.Map({
  excerptData: {
    keyword: '',
    rows: [],
    utiSets: [],
    isAppend: false
  },
  keyword: '',
  isLoading: false,
  searchError: null
});

const actionsMap = {

  [SET_EXCERPT_DATA]: (state, action) => state.set('excerptData', action.data),

  [SET_LOADING]: (state, action) => state.set('isLoading', action.isLoading),

  [SET_LOADING_MORE]: (state, action) => state.set('isLoadingMore', action.isLoadingMore),

  [SET_KEYWORD]: (state, action) => state.set('keyword', action.keyword),

  [SET_SEARCH_ERROR]: (state, action) => state.set('searchError', action.err)

};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

export function loadMore(keyword, utiSets) {

  return async (dispatch, getState) => {

    const state = getState().keyboardSearch;
    const isLoadingMore = state.get('isLoadingMore');

    if (isLoadingMore) {
      return;
    }

    dispatch(setLoadingMore(true));

    let utis = utiSets.shift();

    const rows = await fetch({uti: utis, q: keyword});

    dispatch(setExcerptData({
      rows,
      isAppend: true,
      keyword: state.get('excerptData').keyword,
      utiSets
    }));

    dispatch(setLoadingMore(false));
  };
}

export function search(keyword) {

  return async dispatch => {

    dispatch(setLoading(true));

    if (! keyword) {
      dispatch(setExcerptData({
        keyword,
        rows: [],
        utiSets: [],
        isAppend: false
      }));
      dispatch(setLoading(false));
      return;
    }

    if (isPbId(keyword)) {
      let rows = await fetch({uti: keyword}) || [];
      dispatch(setExcerptData({
        keyword,
        rows,
        utiSets: [],
        isAppend: false
      }));
      dispatch(setLoading(false));
      return;
    }

    let utiRows = await filter({
      'phrase_sep': '།',
      q: keyword,
      field: 'head'
    });

    if (_.isEmpty(utiRows)) {
      dispatch(setExcerptData({
        keyword,
        rows: [],
        utiSets: [],
        isAppend: false
      }));
      dispatch(setLoading(false));
      return;
    }

    let utis = _.pluck(utiRows, 'uti');
    let utiSets = _.chunk(utis, CHUNK_SIZE);
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

    dispatch(setLoading(false));
  };
}

export function setExcerptData(data) {
  return {
    type: SET_EXCERPT_DATA,
    data
  };
}

export function setLoading(isLoading) {
  return {
    type: SET_LOADING,
    isLoading
  };
}

export function setLoadingMore(isLoadingMore) {
  return {
    type: SET_LOADING_MORE,
    isLoadingMore
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
