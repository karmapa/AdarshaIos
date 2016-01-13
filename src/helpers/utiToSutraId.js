import _ from 'lodash';
import {fetch} from '.';

export default function utiToSutraId(uti) {

  return new Promise((resolve, reject) => {

    fetch({uti, fields: 'sutra'})
      .then(rows => {
        let sutraId = _.first(_.first(rows).values);
        resolve(sutraId);
      })
      .catch(err => {
        reject(err);
      });
  });
}
