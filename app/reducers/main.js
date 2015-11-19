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

  // d: depth
  // n: next
  // o: open
  // t: text

  let tocRows = _.get(action.res, 'toc', []);
  let root = tocRows.shift();
  root.children = [];

  let current = root;
  let prev = root;
  let stacks = [];

  _.each(tocRows, (row, index) => {

    row.index = index;

    if (prev.d < row.d) {
      current = prev;
      current.children = [];
      stacks.push(current);
    }

    if (prev.d > row.d) {
      stacks.pop();
      current = _.last(stacks);
    }

    row.parent = current;
    current.children.push(row);
    prev = row;
  });

  return state.set('tocRows', root.children);
}

function setTocHits(state, action) {
  let tocHits = _.get(action.res, 'hits', []);
  return state.set('tocHits', tocHits);
}

function setTocError(state, action) {
  return state.set('tocError', action.tocError);
}
