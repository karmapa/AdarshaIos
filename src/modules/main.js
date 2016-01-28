import Immutable from 'immutable';
import _ from 'lodash';

import {openDb as open, storage, getOrientation, getDeviceSize} from '../helpers';

const MERGE_SETTINGS = 'MAIN::MERGE_SETTINGS';
const SET_BACKGROUND_INDEX = 'MAIN::SET_BACKGROUND_INDEX';
const SET_DB = 'MAIN::SET_DB';
const SET_DB_ERROR = 'MAIN::SET_DB_ERROR';
const SET_FONT_SIZE = 'MAIN::SET_FONT_SIZE';
const SET_KEYBOARD_HEIGHT = 'MAIN::SET_KEYBOARD_HEIGHT';
const SET_LINE_HEIGHT = 'MAIN::SET_LINE_HEIGHT';
const SET_LOADING = 'MAIN::SET_LOADING';
const SET_SELECTED_TAB = 'MAIN::SET_SELECTED_TAB';
const SET_SIDE_MENU_STATUS = 'MAIN::SET_SIDE_MENU_STATUS';
const SET_SUTRA_MAP = 'MAIN::SET_SUTRA_MAP';
const SET_WYLIE_STATUS = 'MAIN::SET_WYLIE_STATUS';
const SET_ORIENTATION = 'MAIN::SET_ORIENTATION';
const SET_DEVICE_WIDTH = 'MAIN::SET_DEVICE_WIDTH';
const SET_DEVICE_HEIGHT = 'MAIN::SET_DEVICE_HEIGHT';

const defaultReaderSettings = {
  backgroundIndex: 1,
  fontSize: 16,
  lineHeight: 2,
  wylieOn: false
};

const initialState = Immutable.Map(Object.assign({
  db: null,
  dbError: null,
  isLoading: false,
  isSideMenuOpen: false,
  keyboardHeight: 0,
  keyboardOn: false,
  selectedTab: 'category',
  sutraMap: {},
  orientation: 'PROTRAIT',    // PROTRAIT or LANDSCAPE
  deviceWidth: 0,
  deviceHeight: 0
}, defaultReaderSettings));

const actionsMap = {

  [MERGE_SETTINGS]: (state, action) => state.merge(action.settings),

  [SET_BACKGROUND_INDEX]: (state, action) => state.set('backgroundIndex', action.backgroundIndex),

  [SET_DB]: (state, action) => state.set('db', action.db),

  [SET_DB_ERROR]: (state, action) => state.set('dbError', action.err),

  [SET_FONT_SIZE]: (state, action) => state.set('fontSize', action.fontSize),

  [SET_LINE_HEIGHT]: (state, action) => state.set('lineHeight', action.lineHeight),

  [SET_LOADING]: (state, action) => state.set('isLoading', action.isLoading),

  [SET_SELECTED_TAB]: (state, action) => state.set('selectedTab', action.selectedTab),

  [SET_SIDE_MENU_STATUS]: (state, action) => state.set('isSideMenuOpen', action.isSideMenuOpen),

  [SET_SUTRA_MAP]: (state, action) => state.set('sutraMap', action.sutraMap),

  [SET_WYLIE_STATUS]: (state, action) => state.set('wylieOn', action.wylieStatus),

  [SET_KEYBOARD_HEIGHT]: (state, action) => state.set('keyboardHeight', action.keyboardHeight),

  [SET_ORIENTATION]: (state, action) => state.set('orientation', action.orientation),

  [SET_DEVICE_WIDTH]: (state, action) => state.set('deviceWidth', action.width),

  [SET_DEVICE_HEIGHT]: (state, action) => state.set('deviceHeight', action.height)
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
  };
}

export function setLineHeight(lineHeight) {
  return {
    type: SET_LINE_HEIGHT,
    lineHeight
  };
}

export function setWylieStatus(wylieStatus) {
  return {
    type: SET_WYLIE_STATUS,
    wylieStatus
  };
}

export function setBackgroundIndex(backgroundIndex) {
  return {
    type: SET_BACKGROUND_INDEX,
    backgroundIndex
  };
}

export function setKeyboardHeight(keyboardHeight) {
  return {
    type: SET_KEYBOARD_HEIGHT,
    keyboardHeight
  };
}

export function setOrientation(orientation) {
  return {
    type: SET_ORIENTATION,
    orientation
  };
}

export function setDeviceWidth(width) {
  return {
    type: SET_DEVICE_WIDTH,
    width
  };
}

export function setDeviceHeight(height) {
  return {
    type: SET_DEVICE_HEIGHT,
    height
  };
}

export function setDeviceOrientation() {
  return async (dispatch) => {
    let orientation = await getOrientation();
    dispatch(setOrientation(orientation));
  };
}

export function setDeviceSize() {

  let {width, height} = getDeviceSize();

  return async dispatch => {
    dispatch(setDeviceWidth(width));
    dispatch(setDeviceHeight(height));
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
  return async (dispatch, getState) => {
    let newFontSize = getState().main.get('fontSize') - 1;
    if (newFontSize > 0) {
      await setReaderSettings({fontSize: newFontSize});
      dispatch(setFontSize(newFontSize));
    }
  };
}

export function increaseLineHeight() {
  return async (dispatch, getState) => {
    let newLineHeight = parseFloat((getState().main.get('lineHeight') + 0.1).toFixed(1));
    if (newLineHeight < 30) {
      await setReaderSettings({lineHeight: newLineHeight});
      dispatch(setLineHeight(newLineHeight));
    }
  };
}

export function decreaseLineHeight() {
  return async (dispatch, getState) => {
    let newLineHeight = parseFloat((getState().main.get('lineHeight') - 0.1).toFixed(1));
    if (newLineHeight > 0) {
      await setReaderSettings({lineHeight: newLineHeight});
      dispatch(setLineHeight(newLineHeight));
    }
  };
}

export function toggleWylieStatus() {
  return async (dispatch, getState) => {
    let newWylieStatus = ! getState().main.get('wylieOn');
    await setReaderSettings({toggleWylieStatus: newWylieStatus});
    dispatch(setWylieStatus(newWylieStatus));
  };
}

export function setBackground(backgroundIndex) {
  return async (dispatch, getState) => {
    await setReaderSettings({backgroundIndex});
    dispatch(setBackgroundIndex(backgroundIndex));
  };
}
