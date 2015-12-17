import Immutable from 'immutable';

const SET_UTI = 'SET_UTI';
const SET_TOOLBAR_STATUS = 'SET_TOOLBAR_STATUS';

const initialState = Immutable.Map({
  uti: '',
  toolbarOn: true
});

const actionsMap = {

  [SET_TOOLBAR_STATUS]: (state, action) => state.set('toolbarOn', action.toolbarOn),

  [SET_UTI]: (state, action) => state.set('uti', action.uti)

};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

export function setUti(uti) {
  return {
    type: SET_UTI,
    uti
  };
}

export function setToolbarStatus(toolbarOn) {
  return {
    type: SET_TOOLBAR_STATUS,
    toolbarOn
  };
}
