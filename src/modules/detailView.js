import Immutable from 'immutable';

const SET_FIRST_SCROLL = 'SET_FIRST_SCROLL';
const SET_TOOLBAR_STATUS = 'SET_TOOLBAR_STATUS';

const initialState = Immutable.Map({
  firstScroll: false,
  toolbarOn: true
});

const actionsMap = {

  [SET_FIRST_SCROLL]: (state, action) => state.set('firstScroll', action.scrolled),

  [SET_TOOLBAR_STATUS]: (state, action) => state.set('toolbarOn', action.toolbarOn)
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

export function setToolbarStatus(toolbarOn) {
  return {
    type: SET_TOOLBAR_STATUS,
    toolbarOn
  };
}
