import ksa from 'ksana-simple-api';
import {DB_NAME} from '../constants/AppConstants';
import {utiToSutraId, getFieldRange, filter, utiGreaterThan, utiLessThan, isValidUti, fetch} from '.';
import _ from 'lodash';

export default function searchInSutra(options = {}) {

  options = Object.assign({
    query: '',
    uti: '',
    direction: 'bottom',
  }, options);

  const {query, uti, direction} = options;
  const compare = ('bottom' === direction) ? utiGreaterThan : utiLessThan;

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
      return rows.filter(row => {
        return isValidUti(row.uti) && compare(row.uti, uti);
      })
      .map(row => {
        return row.uti;
      });
    })
    .then(utis => {
      if (_.isEmpty(utis)) {
        return [];
      }
      return fetch({q: query, uti: utis});
    });

}
