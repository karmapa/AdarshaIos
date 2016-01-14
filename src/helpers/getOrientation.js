import Orientation from 'react-native-orientation';

export default function getOrientation() {

  return new Promise((resolve, reject) => {

    Orientation.getOrientation((err, orientation) => {

      if (err) {
        reject(err);
      }
      else {
        resolve(orientation);
      }

    });
  });
}
