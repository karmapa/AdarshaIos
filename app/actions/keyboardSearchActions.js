
import kse from 'ksana-search';

export const SEARCH = 'SEARCH';

export function search(db, keyword, options) {

  return dispatch => {
    kse.search(db, keyword, options, (err, data) => {
      if (err) {
        dispatch(setSearchError(err));
        return;
      }
      dispatch(setExcerpts(data.excerpt || []));
    })
  };
}

export const SET_EXCERPTS = 'SET_EXCERPTS';

export function setExcerpts(excerpts) {
  return {
    type: SET_EXCERPTS,
    excerpts
  };
}

export const SET_SEARCH_ERROR = 'SET_SEARCH_ERROR';

export function setSearchError(searchError) {
  return {
    type: SET_SEARCH_ERROR,
    searchError
  };
}
