import Immutable from 'immutable';

const SET_UTI = 'SET_UTI';

const initialState = Immutable.Map({
  uti: ''
});

const actionsMap = {

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
