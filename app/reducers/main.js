import * as types from '../actions/mainActions';
import Immutable from 'immutable';
import _ from 'lodash';

const initialState = Immutable.Map({
  db: null,
  dbError: null,
  sutraMap: {},
  selectedTab: 'category',
  toWylie: false,
  fontSize: 16,
  lineHeight: 2
});

const actionsMap = {
  [types.SET_DB]: setDb,
  [types.SET_DB_ERROR]: setDbError,
  [types.SET_SELECTED_TAB]: setSelectedTab,
  [types.SET_TOC_ROWS]: setTocRows,
  [types.SET_TOC_ERROR]: setTocError,
  [types.SET_FONT_SIZE]: setFontSize,
  [types.SET_LINE_HEIGHT]: setLineHeight,
  [types.SET_WYLIE_STATUS]: setWylieStatus,
  [types.SET_SUTRA_MAP]: setSutraMap
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
  let root = _.first(tocRows);
  root.isRoot = true;
  root.children = [];

  let parent;

  tocRows = tocRows.filter(row => row.d <= 3);

  _.each(tocRows, (row, index) => {

    if (0 === index) {
      return true;
    }

    let prev = tocRows[index - 1];
    row.children = [];

    if (prev.d < row.d) {
      parent = prev;
    }
    if (prev.d > row.d) {
      parent = findParent(tocRows, row.d, index - 1);
    }
    parent.children.push(row);
  });

  return state.set('tocRows', root.children);
}

function findParent(rows, depth, index) {
  while (index >= 0) {
    let row = rows[index];
    if (row.d < depth) {
      return row;
    }
    index--;
  }
}

function setTocHits(state, action) {
  let tocHits = _.get(action.res, 'hits', []);
  return state.set('tocHits', tocHits);
}

function setTocError(state, action) {
  return state.set('tocError', action.tocError);
}

function setFontSize(state, action) {
  return state.set('fontSize', action.fontSize);
}

function setLineHeight(state, action) {
  return state.set('lineHeight', action.lineHeight);
}

function setWylieStatus(state, action) {
  return state.set('toWylie', action.status);
}

function setSutraMap(state, action) {
  return state.set('sutraMap', action.sutraMap);
}
