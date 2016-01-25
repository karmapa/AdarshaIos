import _ from 'lodash';
import {fetch} from '.';

export default function vposToSutraId(vpos) {

  return new Promise((resolve, reject) => {

    fetch({vpos, fields: 'sutra'})
      .then(rows => {
        let sutraId = _.first(_.first(rows).values);
        resolve(sutraId);
      })
      .catch(err => {
        reject(err);
      });
  });
}
