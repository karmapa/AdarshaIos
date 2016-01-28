import React, {Dimensions} from 'react-native';

export default function getDeviceSize() {
  let {width, height} = Dimensions.get('window');
  if (height < width) {
    [width, height] = [height, width];
  }
  return {width, height};
}
