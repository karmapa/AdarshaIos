import kde from 'ksana-database';
import {DB_NAME} from '../constants/AppConstants';

export default function openDb(dbName = DB_NAME) {

  return new Promise((resolve, reject) => {

    kde.open(dbName, function(err, db) {
      if (db) {
        resolve(db);
      }
      else {
        reject(err);
      }
    });
  });
}
