import ksa from 'ksana-simple-api';
import {DB_NAME} from '../constants/AppConstants';
import {isCrashStr} from '.';

export default function fetch(options) {

  return new Promise((resolve, reject) => {

    options = Object.assign({db: DB_NAME}, options);

    if (isCrashStr(options.q)) {
      options.q = '';
    }

    ksa.fetch(options, (err, rows) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(rows);
      }
    });
  });
}
