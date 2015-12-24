import {DB_NAME} from '../constants/AppConstants';
import {KsanaFileSystem as kfs} from 'NativeModules';

// shouldn't bind kfs to global
global.kfs = kfs;

// MUST write require so ksana-database can get the kfs object
let kde = require('ksana-database');

if (! kfs) {
  throw 'Ksana file system not found. Have you imported ksana-react-native in xcode ?';
}

export default function openDb(dbName = DB_NAME) {

  return new Promise((resolve, reject) => {

    kde.open(dbName, function(err, db) {
      if (db) {
        resolve(db);
      }
      else {
        resject(err);
      }
    });
  });
}
