import Immutable from 'immutable';

const SET_FONT_SIZE = 'SET_FONT_SIZE';
const SET_LINE_HEIGHT = 'SET_LINE_HEIGHT';
const SET_TOOLBAR_STATUS = 'SET_TOOLBAR_STATUS';
const SET_UTI = 'SET_UTI';
const SET_WYLIE_STATUS = 'SET_WYLIE_STATUS';

const initialState = Immutable.Map({
  fontSize: 16,
  lineHeight: 2,
  toolbarOn: true,
  uti: '',
  wylieOn: false
});

const actionsMap = {

  [SET_FONT_SIZE]: (state, action) => state.set('fontSize', action.fontSize),

  [SET_LINE_HEIGHT]: (state, action) => state.set('lineHeight', action.lineHeight),

  [SET_TOOLBAR_STATUS]: (state, action) => state.set('toolbarOn', action.toolbarOn),

  [SET_UTI]: (state, action) => state.set('uti', action.uti),

  [SET_WYLIE_STATUS]: (state, action) => state.set('wylieOn', action.wylieStatus)

};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
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

export function setToolbarStatus(toolbarOn) {
  return {
    type: SET_TOOLBAR_STATUS,
    toolbarOn
  };
}

export function setUti(uti) {
  return {
    type: SET_UTI,
    uti
  };
}

export function setWylieStatus(wylieStatus) {
  return {
    type: SET_WYLIE_STATUS,
    wylieStatus
  };
}