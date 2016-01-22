import ksa from 'ksana-simple-api';
import {DB_NAME} from '../constants/AppConstants';
import {utiToSutraId, getFieldRange, filter, fetch} from '.';
import _ from 'lodash';

export default function searchInSutra(options = {}) {

  options = Object.assign({
    query: '',
    uti: '',
    direction: 'bottom',
  }, options);

  const {query, uti, direction} = options;

  return utiToSutraId(uti)
    .then(sutraId => {

      return getFieldRange({
        field: 'sutra',
        values: [sutraId]
      });
    })
    .then(ranges => {

      return filter({
        field: 'head',
        ranges,
        q: query
      });
    })
    .then(rows => {
      let utis = _.pluck(rows, 'uti');
      let needle = utis.indexOf(uti);

      if ('bottom' === direction) {
        return utis.filter((u, index) => index > needle);
      }
      return utis.filter((u, index) => index < needle);
    })
    .then(utis => {
      if (_.isEmpty(utis)) {
        return [];
      }
      return fetch({q: query, uti: utis});
    });

}
