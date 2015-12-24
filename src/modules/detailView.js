import Immutable from 'immutable';

const SET_FIRST_SCROLL = 'SET_FIRST_SCROLL';
const SET_FONT_SIZE = 'SET_FONT_SIZE';
const SET_LINE_HEIGHT = 'SET_LINE_HEIGHT';
const SET_TOOLBAR_STATUS = 'SET_TOOLBAR_STATUS';
const SET_WYLIE_STATUS = 'SET_WYLIE_STATUS';

const initialState = Immutable.Map({
  firstScroll: false,
  fontSize: 16,
  lineHeight: 2,
  toolbarOn: true,
  wylieOn: false
});

const actionsMap = {

  [SET_FIRST_SCROLL]: (state, action) => state.set('firstScroll', action.scrolled),

  [SET_FONT_SIZE]: (state, action) => state.set('fontSize', action.fontSize),

  [SET_LINE_HEIGHT]: (state, action) => state.set('lineHeight', action.lineHeight),

  [SET_TOOLBAR_STATUS]: (state, action) => state.set('toolbarOn', action.toolbarOn),

  [SET_WYLIE_STATUS]: (state, action) => state.set('wylieOn', action.wylieStatus)

};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

export function setFirstScroll(scrolled) {
  return {
    type: SET_FIRST_SCROLL,
    scrolled
  }
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

export function setWylieStatus(wylieStatus) {
  return {
    type: SET_WYLIE_STATUS,
    wylieStatus
  };
}

export function increaseFontSize() {
  return (dispatch, getState) => {
    let newFontSize = getState().detailView.get('fontSize') + 1;
    if (newFontSize < 30) {
      dispatch(setFontSize(newFontSize));
    }
  };
}

export function decreaseFontSize() {
  return (dispatch, getState) => {
    let newFontSize = getState().detailView.get('fontSize') - 1;
    if (newFontSize > 0) {
      dispatch(setFontSize(newFontSize));
    }
  };
}

export function increaseLineHeight() {
  return (dispatch, getState) => {
    let newLineHeight = getState().detailView.get('lineHeight') + 1;
    if (newLineHeight < 30) {
      dispatch(setLineHeight(newLineHeight));
    }
  };
}
