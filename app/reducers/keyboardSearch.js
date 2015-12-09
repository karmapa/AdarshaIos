import * as types from '../actions/keyboardSearchActions';
import Immutable from 'immutable';

const initialState = Immutable.Map({
  excerpts: [],
  searchError: null
});

const actionsMap = {
  [types.SET_EXCERPTS]: setExcerpts,
  [types.SET_SEARCH_ERROR]: setSearchError
};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

function setExcerpts(state, action) {
  return state.set('excerpts', action.excerpts);
}

function setSearchError(state, action) {
  return state.set('searchError', action.searchError);
}
