import Immutable from 'immutable';
import _ from 'lodash';
import {fetch, findBiographyBySutraId} from '../helpers';

const SET_BIOGRAPHY = 'SET_BIOGRAPHY';
const SET_BIOGRAPHY_HAS_SCROLLED = 'SET_BIOGRAPHY_HAS_SCROLLED';
const SET_BIOGRAPHY_LOADING = 'SET_BIOGRAPHY_LOADING';
const SET_BIOGRAPHY_TOOLBAR_STATUS = 'SET_BIOGRAPHY_TOOLBAR_STATUS';

const initialState = Immutable.Map({
  biography: null,
  hasScrolled: false,
  isLoading: false,
  toolbarOn: true
});

const actionsMap = {

  [SET_BIOGRAPHY]: (state, action) => state.set('biography', action.biography),

  [SET_BIOGRAPHY_HAS_SCROLLED]: (state, action) => state.set('hasScrolled', action.hasScrolled),

  [SET_BIOGRAPHY_LOADING]: (state, action) => state.set('isLoading', action.isLoading),

  [SET_BIOGRAPHY_TOOLBAR_STATUS]: (state, action) => state.set('toolbarOn', action.toolbarOn)

};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

export function loadBiographyByUti(uti) {

  return dispatch => {

    dispatch(setBiographyLoading(true));

    return fetch({uti, fields: 'sutra'})
      .then(rows => {
        let sutraId = _.first(_.first(rows).values);
        return findBiographyBySutraId(sutraId)
      })
      .then(biography => {
        dispatch(setBiography(biography));
      })
      .finally(() => dispatch(setBiographyLoading(false)));
  };
}

export function setBiography(biography) {
  return {
    type: SET_BIOGRAPHY,
    biography
  };
}

export function setBiographyLoading(isLoading) {
  return {
    type: SET_BIOGRAPHY_LOADING,
    isLoading
  };
}

export function setBiographyToolbarStatus(toolbarOn) {
  return {
    type: SET_BIOGRAPHY_TOOLBAR_STATUS,
    toolbarOn
  };
}

export function setBiographyHasScrolled(hasScrolled) {
  return {
    type: SET_BIOGRAPHY_HAS_SCROLLED,
    hasScrolled
  }
}

export const fields = [
  {key: 'vol', name: 'པོད་རྟགས།'},
  {key: 'page', name: 'ཤོག་གྲངས།'},
  {key: 'tname', name: 'མདོ་མིང་།'},
  {key: 'aname', name: 'མདོ་མིང་གཞན།'},
  {key: 'sname', name: 'རྒྱ་གར་མདོ་མིང་།'},
  {key: 'cname', name: 'རྒྱ་ནག་མདོ་མིང་།'},
  {key: 'homeage', name: 'བསྒྱུར་ཕྱག'},
  {key: 'subject', name: 'བརྗོད་བྱ།'},
  {key: 'yana', name: 'ཐེག་པ།'},
  {key: 'chakra', name: 'དཀའ། འཁོར་ལོ།'},
  {key: 'location', name: 'གནས་ཕུན་སུམ་ཚོགས་པ།'},
  {key: 'audience', name: 'འཁོར་ཕུན་སུམ་ཚོགས་པ།'},
  {key: 'author', name: 'སྟོན་པ་ཕུན་སུམ་ཚོགས་པ།'},
  {key: 'requestor', name: 'ཞུ་བ་པོ་ཕུན་སུམ་ཚོགས་པ།'},
  {key: 'dharma', name: 'ཆོས་ཕུན་སུམ་ཚོགས་པ།'},
  {key: 'purpose', name: 'ཆོས་ཀྱི་དགོས་དོན།'},
  {key: 'collect', name: 'བསྡུས་པའི་དོན། ལེའུ།'},
  {key: 'bampo', name: 'བམ་པོ། ཤོ་ལོ་ཀ'},
  {key: 'relation', name: 'མཚམས་སྦྱར་བའི་གོ་རིམ།'},
  {key: 'debate', name: 'རྒལ་ལན།'},
  {key: 'translator', name: 'ལོ་ཙཱ་བ།'},
  {key: 'reviser', name: 'ཞུ་དག་པ།'}
];
