import React, {View} from 'react-native';
import {Spinner} from 'react-native-icons';
import {styles as globalStyles} from '../styles/global.style';

export default function renderSpinner() {

  let spinnerProps = {
    name: 'ion|load-c',
    size: 24,
    color: '#777',
    style: globalStyles.spinner
  };

  return (
    <View style={globalStyles.viewSpinner}>
      <Spinner {...spinnerProps} />
    </View>
  );
}
