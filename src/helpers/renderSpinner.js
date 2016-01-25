import React, {View} from 'react-native';
import {Spinner} from 'react-native-icons';
import {styles as globalStyles} from '../styles/global.style';

export default function renderSpinner(options = {}) {

  let spinnerProps = {
    name: 'ion|load-c',
    size: 24,
    color: '#777',
    style: globalStyles.spinner
  };

  let viewStyle = [globalStyles.viewSpinner];

  if (options.transparent) {
    viewStyle.push({backgroundColor: 'transparent'});
  }

  return (
    <View style={viewStyle}>
      <Spinner {...spinnerProps} />
    </View>
  );
}
