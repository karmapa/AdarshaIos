import Immutable from 'immutable';
import _ from 'lodash';

const storage = require('../helpers/storage');
const open = require('../helpers/openDb');

const MERGE_SETTINGS = 'MERGE_SETTINGS';
const SET_DB = 'SET_DB';
const SET_DB_ERROR = 'SET_DB_ERROR';
const SET_FONT_SIZE = 'SET_FONT_SIZE';
const SET_LINE_HEIGHT = 'SET_LINE_HEIGHT';
const SET_LOADING = 'SET_LOADING';
const SET_SELECTED_TAB = 'SET_SELECTED_TAB';
const SET_SIDE_MENU_STATUS = 'SET_SIDE_MENU_STATUS';
const SET_SUTRA_MAP = 'SET_SUTRA_MAP';
const SET_TOC_ROWS = 'SET_TOC_ROWS';
const SET_WYLIE_STATUS = 'SET_WYLIE_STATUS';

const defaultReaderSettings = {
  fontSize: 16,
  lineHeight: 2,
  wylieOn: false
};

const initialState = Immutable.Map(Object.assign({
  db: null,
  dbError: null,
  isLoading: false,
  selectedTab: 'category',
  isSideMenuOpen: false,
  sutraMap: {}
}, defaultReaderSettings));

const actionsMap = {

  [MERGE_SETTINGS]: (state, action) => state.merge(action.settings),

  [SET_DB]: (state, action) => state.set('db', action.db),

  [SET_DB_ERROR]: (state, action) => state('dbError', action.err),

  [SET_FONT_SIZE]: (state, action) => state.set('fontSize', action.fontSize),

  [SET_LINE_HEIGHT]: (state, action) => state.set('lineHeight', action.lineHeight),

  [SET_LOADING]: (state, action) => state.set('isLoading', action.isLoading),

  [SET_SELECTED_TAB]: (state, action) => state.set('selectedTab', action.selectedTab),

  [SET_SIDE_MENU_STATUS]: (state, action) => state.set('isSideMenuOpen', action.isSideMenuOpen),

  [SET_SUTRA_MAP]: (state, action) => state.set('sutraMap', action.sutraMap),

  [SET_WYLIE_STATUS]: (state, action) => state.set('wylieOn', action.wylieStatus)

};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

export function loadStorage() {

  return async dispatch => {
    const existedReaderSettings = await storage.get('readerSettings');
    const readerSettings = Object.assign({}, defaultReaderSettings, existedReaderSettings);
    dispatch(mergeSettings(readerSettings));
  };
}

export async function setReaderSettings(data) {
  let existedReaderSettings = await storage.get('readerSettings') || {};
  await storage.set('readerSettings', Object.assign(existedReaderSettings, data));
}

export function openDb() {

  return dispatch => {

    return open()
      .then(db => {

        db.get([['fields', 'sutra'], ['fields', 'sutra_vpos'], ['fields', 'head']], fields => {
          let [sutraIds, sutraVposs, heads] = fields;
          let rows = sutraVposs.map((vpos, index) => ({vpos, head: heads[index]}));
          let sutraMap = _.object(sutraIds, rows);
          dispatch(setSutraMap(sutraMap));
        });
        dispatch(setDb(db));
        return db;
      })
      .catch(err => {
        dispatch(setDbError(err));
        return err;
      });
  };
}

export function mergeSettings(settings) {
  return {
    type: MERGE_SETTINGS,
    settings
  }
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

export function setLoading(isLoading) {
  return {
    type: SET_LOADING,
    isLoading
  };
}

export function setSelectedTab(selectedTab) {
  return {
    type: SET_SELECTED_TAB,
    selectedTab
  };
}

export function setSideMenuStatus(isSideMenuOpen) {
  return {
    type: SET_SIDE_MENU_STATUS,
    isSideMenuOpen
  };
}

export function setSutraMap(sutraMap) {
  return {
    type: SET_SUTRA_MAP,
    sutraMap
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

export function setWylieStatus(wylieStatus) {
  return {
    type: SET_WYLIE_STATUS,
    wylieStatus
  };
}

export function increaseFontSize() {
  return async (dispatch, getState) => {
    let newFontSize = getState().main.get('fontSize') + 1;
    if (newFontSize < 30) {
      await setReaderSettings({fontSize: newFontSize});
      dispatch(setFontSize(newFontSize));
    }
  };
}

export function decreaseFontSize() {
  return (dispatch, getState) => {
    let newFontSize = getState().main.get('fontSize') - 1;
    if (newFontSize > 0) {
      dispatch(setFontSize(newFontSize));
    }
  };
}

export function increaseLineHeight() {
  return (dispatch, getState) => {
    let newLineHeight = getState().main.get('lineHeight') + 0.1;
    if (newLineHeight < 30) {
      dispatch(setLineHeight(newLineHeight));
    }
  };
}

export function decreaseLineHeight() {
  return (dispatch, getState) => {
    let newLineHeight = getState().main.get('lineHeight') - 0.1;
    if (newLineHeight > 0) {
      dispatch(setLineHeight(newLineHeight));
    }
  };
}

export function toggleWylieStatus() {
  return (dispatch, getState) => {
    let status = getState().main.get('wylieOn');
    dispatch(setWylieStatus(! status));
  };
}
