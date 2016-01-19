import ksa from 'ksana-simple-api';
import {DB_NAME} from '../constants/AppConstants';
import {utiToSutraId, getFieldRange, filter, utiGreaterThan, isValidUti} from '.';

export default function searchInSutra(query, uti) {

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
        return isValidUti(row.uti) && utiGreaterThan(row.uti, uti);
      });
    });

}
