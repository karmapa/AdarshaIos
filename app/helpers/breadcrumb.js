import {DB_NAME} from '../constants/AppConstants';

let ksa = require('ksana-simple-api');

export default function breadcrumb(options) {

  return new Promise((resolve, reject) => {

    options = Object.assign({db: DB_NAME}, options);

    ksa.breadcrumb(options, (err, data) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    });
  });
}
