import Immutable from 'immutable';

const SET_FIELDS_DATA = 'ADVANCE_SEARCH::SET_FIELDS_DATA';

const initialState = Immutable.Map({
  division: 0,
  tname: '',
  yana: '',
  chakra: '',
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

export const fields = [
  {name: 'tname', placeholder: 'མདོ་མིང་།:'},
  {name: 'yana', placeholder: 'ཐེག་པ།:'},
  {name: 'chakra', placeholder: 'དཀའ། འཁོར་ལོ།:'},
  {name: 'location', placeholder: 'གནས་ཕུན་སུམ་ཚོགས་པ།:'},
  {name: 'translator', placeholder: 'ལོ་ཙཱ་བ།:'},
  {name: 'reviser', placeholder: 'ཞུ་དག་པ།:'}
];
