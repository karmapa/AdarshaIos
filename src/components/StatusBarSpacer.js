import React, {Component, View} from 'react-native';
import {styles} from './StatusBarSpacer.style';

class StatusBarSpacer extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <View style={styles.statusBarSpacer} />;
  }
}

export default StatusBarSpacer;
