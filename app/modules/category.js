import Immutable from 'immutable';
import _ from 'lodash';
import {toc} from '../helpers';

const SET_TOC_ERROR = 'SET_TOC_ERROR';
const SET_TOC_HITS = 'SET_TOC_HITS';
const SET_TOC_ROWS = 'SET_TOC_ROWS';

const initialState = Immutable.Map({
  tocRows: []
});

const actionsMap = {

  [SET_TOC_ERROR]: (state, action) => state.set('tocError', action.err),

  [SET_TOC_HITS]: (state, action) => state.set('tocHits', action.res.hits),

  [SET_TOC_ROWS]: (state, action) => state.set('tocRows', buildTocRows(action.res))

};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

function buildTocRows(res) {

  // d: depth
  // n: next
  // o: open
  // t: text

  let tocRows = _.get(res, 'toc', []);
  let root = _.first(tocRows);
  root.isRoot = true;
  root.children = [];

  let parent;

  tocRows = tocRows.filter(row => row.d <= 3);

  _.each(tocRows, (row, index) => {

    if (0 === index) {
      return true;
    }

    let prev = tocRows[index - 1];
    row.children = [];

    if (prev.d < row.d) {
      parent = prev;
    }
    if (prev.d > row.d) {
      parent = findParent(tocRows, row.d, index - 1);
    }
    parent.children.push(row);
  });

  return root.children;
}

function findParent(rows, depth, index) {
  while (index >= 0) {
    let row = rows[index];
    if (row.d < depth) {
      return row;
    }
    index--;
  }
}

export function openToc() {

  return dispatch => {
    return new Promise((resolve, reject) => {

      toc()
        .then(res => {
          dispatch(setTocRows(res));
          dispatch(setTocHits(res));
          resolve(res);
        })
        .catch(err => {
          dispatch(setTocError(err));
          reject(err);
        });
    });
  };
}

export function setTocError(err) {
  return {
    type: SET_TOC_ERROR,
    err
  };
}

export function setTocHits(res) {
  return {
    type: SET_TOC_HITS,
    res
  };
}

export function setTocRows(res) {
  return {
    type: SET_TOC_ROWS,
    res
  };
}
