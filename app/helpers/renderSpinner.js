import React, {View} from 'react-native';
import {Spinner} from 'react-native-icons';
import {styles} from '../styles/global.style';

export default function renderSpinner() {

  let spinnerProps = {
    name: 'ion|load-c',
    size: 24,
    color: '#777',
    style: styles.spinner
  };

  return (
    <View style={styles.viewSpinner}>
      <Spinner {...spinnerProps} />
    </View>
  );
}
