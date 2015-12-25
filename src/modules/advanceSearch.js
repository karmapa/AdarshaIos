import Immutable from 'immutable';

const SET_FIELDS_DATA = 'SET_FIELDS_DATA';

export const fields = [
  {name: 'tname', placeholder: 'མདོ་མིང་།:'},
  {name: 'yana', placeholder: 'ཐེག་པ།:'},
  {name: 'charka', placeholder: 'དཀའ། འཁོར་ལོ།:'},
  {name: 'location', placeholder: 'གནས་ཕུན་སུམ་ཚོགས་པ།:'},
  {name: 'translator', placeholder: 'ལོ་ཙཱ་བ།:'},
  {name: 'reviser', placeholder: 'ཞུ་དག་པ།:'}
];

const initialState = Immutable.Map({
  division: 0,
  tname: '',
  yana: '',
  charka: '',
  location: '',
  translator: '',
  reviser: ''
});

const actionsMap = {
  [SET_FIELDS_DATA]: (state, action) => state.merge(action.data)
};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

export function setFieldsData(data) {
  return {
    type: SET_FIELDS_DATA,
    data
  };
}
