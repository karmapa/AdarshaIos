
import { KsanaFileSystem as kfs } from 'NativeModules';

// shouldn't bind kfs to global
global.kfs = kfs;

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
