import Immutable from 'immutable';
import _ from 'lodash';
import {KsanaFileSystem as kfs} from 'NativeModules';

// shouldn't bind kfs to global
global.kfs = kfs;

let ksa = require('ksana-simple-api');

// MUST write require so ksana-database can get the kfs object
let kde  = require('ksana-database');

if (! kfs) {
  throw 'Ksana file system not found. Have you imported ksana-react-native in xcode ?';
}

const SET_DB = 'SET_DB';
const SET_DB_ERROR = 'SET_DB_ERROR';
const SET_FONT_SIZE = 'SET_FONT_SIZE';
const SET_LINE_HEIGHT = 'SET_LINE_HEIGHT';
const SET_LOADING = 'SET_LOADING';
const SET_SELECTED_TAB = 'SET_SELECTED_TAB';
const SET_SUTRA_MAP = 'SET_SUTRA_MAP';
const SET_TOC_ERROR = 'SET_TOC_ERROR';
const SET_TOC_HITS = 'SET_TOC_HITS';
const SET_TOC_ROWS = 'SET_TOC_ROWS';
const SET_WYLIE_STATUS = 'SET_WYLIE_STATUS';

const initialState = Immutable.Map({
  db: null,
  dbError: null,
  fontSize: 16,
  lineHeight: 2,
  loading: false,
  selectedTab: 'category',
  sutraMap: {},
  toWylie: false,
  tocRows: null
});

const actionsMap = {

  [SET_DB]: (state, action) => state.set('db', action.db),

  [SET_DB_ERROR]: (state, action) => state('dbError', action.err),

  [SET_FONT_SIZE]: (state, action) => state.set('fontSize', action.fontSize),

  [SET_LINE_HEIGHT]: (state, action) => state.set('lineHeight', action.lineHeight),

  [SET_LOADING]: (state, action) => state.set('loading', action.loading),

  [SET_SELECTED_TAB]: (state, action) => state.set('selectedTab', action.selectedTab),

  [SET_SUTRA_MAP]: (state, action) => state.set('sutraMap', action.sutraMap),

  [SET_TOC_ERROR]: (state, action) => state.set('tocError', action.err),

  [SET_TOC_HITS]: (state, action) => state.set('tocHits', action.res.hits),

  [SET_TOC_ROWS]: (state, action) => state.set('tocRows', buildTocRows(action.res)),

  [SET_WYLIE_STATUS]: (state, action) => state.set('toWylie', action.wylieStatus)
};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

function buildTocRows(res) {

  // d: depth
  // n: next
  // o: open
  // t: text

  let tocRows = _.get(res, 'toc', []);
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

  return root.children;
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

export function openDb(dbName) {

  return dispatch => {

    kde.open(dbName, function(err, db) {

      if (db) {
        db.get([['fields', 'sutra_id'], ['fields', 'sutra_vpos'], ['fields', 'head']], (fields) => {
          let [sutraIds, sutraVposs, heads] = fields;
          let rows = sutraVposs.map((vpos, index) => ({vpos, head: heads[index]}));
          let sutraMap = _.object(sutraIds, rows);
          dispatch(setSutraMap(sutraMap));
        });
        dispatch(setDb(db));
      }
      else {
        dispatch(setDbError(err));
      }
    });
  };
}

export function openToc(dbName) {

  return dispatch => {
    let options = {
      db: dbName
    };
    ksa.toc(options, (err, res) => {
      if (err) {
        dispatch(setTocError(err));
      }
      else {
        dispatch(setTocRows(res));
        dispatch(setTocHits(res));
      }
    });
  };
}

export function setDb(db) {
  return {
    type: SET_DB,
    db
  };
}

export function setDbError(err) {
  return {
    type: SET_DB_ERROR,
    err
  };
}
export function setFontSize(fontSize) {
  return {
    type: SET_FONT_SIZE,
    fontSize
  }
}

export function setLineHeight(lineHeight) {
  return {
    type: SET_LINE_HEIGHT,
    lineHeight
  }
}

export function setLoading(loading) {
  return {
    type: SET_LOADING,
    loading
  };
}

export function setSelectedTab(selectedTab) {
  return {
    type: SET_SELECTED_TAB,
    selectedTab
  };
}

export function setSutraMap(sutraMap) {
  return {
    type: SET_SUTRA_MAP,
    sutraMap
  };
}

export function setTocError(err) {
  return {
    type: SET_TOC_ERROR,
    err
  };
}

export function setTocHits(res) {
  return {
    type: SET_TOC_HITS,
    res
  };
}

export function setTocRows(res) {
  return {
    type: SET_TOC_ROWS,
    res
  };
}

export function setWylieStatus(wylieStatus) {
  return {
    type: SET_WYLIE_STATUS,
    wylieStatus
  };
}
