import _ from 'lodash';
import {fetch} from '.';

export default function vposToSutraId(vpos) {

  return new Promise((resolve, reject) => {

    fetch({vpos, fields: 'sutra'})
      .then(res => {
        let sutraId = _.get(res, '[0].values[0]', null);
        resolve(sutraId);
      })
      .catch(err => {
        reject(err);
      });
  });
}
