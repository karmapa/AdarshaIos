import _ from 'lodash';
import {fetch, getFieldRange, vposToUti} from '.';

export default function fetchBySutraId(sutraIds) {

  return getFieldRange({
    field: 'sutra',
    values: sutraIds
  })
  .then(rows => {

    if (_.isEmpty(rows)) {
      return [];
    }

    let vpos = _.map(rows, row => {
      return row[0];
    });

    return vposToUti(vpos);
  })
  .then(utis => {
    if (_.isEmpty(utis)) {
      return [];
    }
    return fetch({uti: utis, fields: 'sutra'});
  });
}
