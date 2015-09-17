
import { KsanaFileSystem as kfs } from 'NativeModules';

// shouldn't bind kfs to global
global.kfs = kfs;

// MUST write require so ksana-database can get the kfs object
let kde  = require('ksana-database');

import kse from 'ksana-search';

if (! kfs) {
  throw 'Ksana file system not found. Have you imported ksana-react-native in xcode ?';
}

export const SET_SELECTED_TAB = 'SET_SELECTED_TAB';

export function setSelectedTab(selectedTab) {
  return {
    type: SET_SELECTED_TAB,
    selectedTab
  };
}
