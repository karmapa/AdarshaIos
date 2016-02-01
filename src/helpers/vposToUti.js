import {DB_NAME} from '../constants/AppConstants';
import ksa from 'ksana-simple-api';

export default function vposToUti(vpos) {

  return new Promise((resolve, reject) => {

    options = Object.assign({db: DB_NAME}, {vpos});

    ksa.vpos2uti(options, (err, uti) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(uti);
      }
    });
  });
}
