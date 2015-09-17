import * as types from '../actions/mainActions';
import Immutable from 'immutable';

const initialState = {
  count: 0
};

export default function counter(state = initialState, action = {}) {
  switch (action.type) {
    case 'test':
      return {
        ...state,
        count: state.count + 1
      };
    default:
      return state;
  }
}
