import {UIManager} from 'NativeModules';

export default function getOffset(handle) {

  return new Promise((resolve, reject) => {
    const fail = err => reject(err);
    const success = (x, y, w, h) => resolve(x, y, w, h);
    UIManager.measureLayoutRelativeToParent(handle, fail, success);
  });
}
