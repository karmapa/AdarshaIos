import ksa from 'ksana-simple-api';
import {DB_NAME} from '../constants/AppConstants';

export default function getFieldRange(options) {

  return new Promise((resolve, reject) => {

    options = Object.assign({db: DB_NAME}, options);

    ksa.getFieldRange(options, (err, ranges) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(ranges);
      }
    });
  });
}
