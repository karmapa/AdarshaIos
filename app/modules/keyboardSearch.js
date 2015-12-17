import Immutable from 'immutable';
import kse from 'ksana-search';
import {fetch} from '../helpers';
import wylie from 'tibetan/wylie';

const SET_EXCERPTS = 'SET_EXCERPTS';
const SET_KEYWORD = '';
const SET_SEARCH_ERROR = 'SET_SEARCH_ERROR';
const SET_KEYBOARD_SEARCH_LOADING = 'SET_KEYBOARD_SEARCH_LOADING';

const initialState = Immutable.Map({
  keyword: '',
  excerpts: [],
  searchError: null,
  loading: false
});

const actionsMap = {

  [SET_EXCERPTS]: (state, action) => state.set('excerpts', action.excerpts),

  [SET_KEYWORD]: (state, action) => state.set('keyword', action.keyword),

  [SET_SEARCH_ERROR]: (state, action) => state.set('searchError', action.err),

  [SET_KEYBOARD_SEARCH_LOADING]: (state, action) => state.set('loading', action.loading)
};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

export function search(keyword) {

  return async (dispatch, getState) => {

    dispatch(setKeyboardSearchLoading(true));

    if (! keyword) {
      dispatch(setExcerpts([]));
      dispatch(setKeyboardSearchLoading(false));
      return;
    }

    if (keyword.match(/^\d+\.\d+[abcd]$/)) {
      let rows = await fetch({uti: keyword}) || [];
      dispatch(setExcerpts(rows));
      dispatch(setKeyboardSearchLoading(false));
      return;
    }

    let state = getState();
    let db = state.main.get('db');

    // escape operators
    keyword = keyword.replace(/\\/g, '\\\\')
      .replace(/\*/, '**');

    keyword = wylie.fromWylie(keyword);
    keyword = keyword.replace(/༌༌/g, '*');
    keyword = removeLoadingEndingSpace(keyword);

    const options = {
      'phrase_sep': '།',
      nohighlight: true,
      range: {
        maxhit: 100
      }
    };

    kse.search(db, keyword, options, (err, data) => {
      if (err) {
        dispatch(setSearchError(err));
        dispatch(setKeyboardSearchLoading(false));
        return;
      }
      dispatch(setExcerpts(data.excerpt || []));
      dispatch(setKeyboardSearchLoading(false));
    })
  };

  function removeLoadingEndingSpace(keyword) {
    if ((! keyword) || (keyword.length < 2)) {
      return keyword;
    }
    return keyword.replace(/^་/, '').replace(/་$/, '');
  }
}

export function setExcerpts(excerpts) {
  return {
    type: SET_EXCERPTS,
    excerpts
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

export function setKeyboardSearchLoading(loading) {
  return {
    type: SET_KEYBOARD_SEARCH_LOADING,
    loading
  };
}
