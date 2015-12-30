import {DB_NAME} from '../constants/AppConstants';

import ksa from 'ksana-simple-api';

export default function toc(options = {}) {

  return new Promise((resolve, reject) => {

    options = Object.assign({db: DB_NAME}, options);

    ksa.toc(options, (err, res) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(res);
      }
    });
  });
}
