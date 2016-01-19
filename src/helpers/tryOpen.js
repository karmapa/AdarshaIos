import ksa from 'ksana-simple-api';
import {DB_NAME} from '../constants/AppConstants';

export default function tryOpen(dbName = DB_NAME) {

  return new Promise((resolve, reject) => {
    ksa.tryOpen(dbName, (err, engine) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(engine);
      }
    });
  });
}
