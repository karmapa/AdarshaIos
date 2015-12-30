import {DB_NAME} from '../constants/AppConstants';
import {KsanaFileSystem as kfs} from 'NativeModules';

import ksa from 'ksana-simple-api';

export default function toc(options = {}) {

  return new Promise((resolve, reject) => {

    options = Object.assign({db: DB_NAME, kfs}, options);

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
