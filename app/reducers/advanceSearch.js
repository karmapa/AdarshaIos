import * as types from '../actions/advanceSearchActions';
import Immutable from 'immutable';

const initialState = Immutable.Map({
  division: 0,
  tname: '',
  aname: '',
  sname: '',
  cname: '',
  subject: '',
  yana: '',
  charka: '',
  location: '',
  purpose: '',
  collect: '',
  relation: '',
  debate: '',
  translator: '',
  reviser: ''
});

const actionsMap = {
  [types.SET_FIELDS_DATA]: setFieldsData
};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

function setFieldsData(state, action) {
  return state.merge(action.data);
}
