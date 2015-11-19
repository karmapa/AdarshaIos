import * as types from '../actions/mainActions';
import Immutable from 'immutable';
import _ from 'lodash';

const initialState = Immutable.Map({
  db: null,
  dbError: null,
  selectedTab: 'category'
});

const actionsMap = {
  [types.SET_DB]: setDb,
  [types.SET_DB_ERROR]: setDbError,
  [types.SET_SELECTED_TAB]: setSelectedTab,
  [types.SET_TOC_ROWS]: setTocRows,
  [types.SET_TOC_ERROR]: setTocError
};

export default function main(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

function setSelectedTab(state, action) {
  return state.set('selectedTab', action.selectedTab);
}

function setDb(state, action) {
  return state.set('db', action.db);
}

function setDbError(state, action) {
  return state.set('dbError', action.err);
}

function setTocRows(state, action) {

  let res = action.res;
  let tocRows = _.get(res, 'toc', []);

  let depths = [];
  let prev = 0;

  return state.set('tocRows', tocRows.map((row, index) => {

    let depth = row.depth;

    // link to previous sibling
    if (prev > depth) {
      if (tocRows[depth]) {
        tocRows[depths[depth]].next = index;
      }
      _.times(prev - depth, index => {
        depths[index] = 0;
      });
      if ((index < tocRows.length - 1) && (tocRows[index + 1].depth > depth)) {
        row.hasChild = true;
      }
      depths[depth] = index;
      prev = depth;
    }
    return row;
  }));
}

function setTocHits(state, action) {
  let tocHits = _.get(action.res, 'hits', []);
  return state.set('tocHits', tocHits);
}

function setTocError(state, action) {
  return state.set('tocError', action.tocError);
}
