import {DB_NAME} from '../constants/AppConstants';
import {KsanaFileSystem as kfs} from 'NativeModules';

import kde from 'ksana-database';

export default function openDb(dbName = DB_NAME) {

  return new Promise((resolve, reject) => {

    kde.open(dbName, {kfs}, function(err, db) {
      if (db) {
        resolve(db);
      }
      else {
        reject(err);
      }
    });
  });
}
