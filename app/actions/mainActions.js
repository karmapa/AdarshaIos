
import { KsanaFileSystem as kfs } from 'NativeModules';

// shouldn't bind kfs to global
global.kfs = kfs;

let ksa = require('ksana-simple-api');

// MUST write require so ksana-database can get the kfs object
let kde  = require('ksana-database');

if (! kfs) {
  throw 'Ksana file system not found. Have you imported ksana-react-native in xcode ?';
}

export const SET_SELECTED_TAB = 'SET_SELECTED_TAB';

export function setSelectedTab(selectedTab) {
  return {
    type: SET_SELECTED_TAB,
    selectedTab
  };
}

export function openDb(dbName) {

  return dispatch => {
    kde.open(dbName, function(err, db) {
      if (db) {
        dispatch(setDb(db));
      }
      else {
        dispatch(setDbError(err));
      }
    });
  };
}

export const SET_DB = 'SET_DB';

export function setDb(db) {
  return {
    type: SET_DB,
    db
  };
}

export const SET_DB_ERROR = 'SET_DB_ERROR';

export function setDbError(err) {
  return {
    type: SET_DB_ERROR,
    err
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

export const SET_TOC_ROWS = 'SET_TOC_ROWS';

export function setTocRows(res) {
  return {
    type: SET_TOC_ROWS,
    res
  };
}

export const SET_TOC_HITS = 'SET_TOC_HITS';

export function setTocHits(res) {
  return {
    type: SET_TOC_HITS,
    res
  };
}

export const SET_TOC_ERROR = 'SET_TOC_ERROR';

export function setTocError(err) {
  return {
    type: SET_TOC_ERROR,
    err
  };
}

export const SET_FONT_SIZE = 'SET_FONT_SIZE';

export function setFontSize(fontSize) {
  return {
    type: SET_FONT_SIZE,
    fontSize
  }
}

export const SET_LINE_HEIGHT = 'SET_LINE_HEIGHT';

export function setLineHeight(lineHeight) {
  return {
    type: SET_LINE_HEIGHT,
    lineHeight
  }
}
