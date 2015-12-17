import Immutable from 'immutable';
import kse from 'ksana-search';
import {fetch} from '../helpers';
import wylie from 'tibetan/wylie';

const SET_EXCERPTS = 'SET_EXCERPTS';
const SET_KEYWORD = '';
const SET_SEARCH_ERROR = 'SET_SEARCH_ERROR';

const initialState = Immutable.Map({
  keyword: '',
  excerpts: [],
  searchError: null
});

const actionsMap = {

  [SET_EXCERPTS]: (state, action) => state.set('excerpts', action.excerpts),

  [SET_KEYWORD]: (state, action) => state.set('keyword', action.keyword),

  [SET_SEARCH_ERROR]: (state, action) => state.set('searchError', action.err)
};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

export function search(keyword) {

  return async (dispatch, getState) => {

    if (! keyword) {
      dispatch(setExcerpts([]));
      return;
    }

    if (keyword.match(/^\d+\.\d+[abcd]$/)) {
      let rows = await fetch({uti: keyword}) || [];
      dispatch(setExcerpts(rows));
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
        return;
      }
      dispatch(setExcerpts(data.excerpt || []));
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
