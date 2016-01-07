import React, {Text, Component, PropTypes} from 'react-native';
import {styles} from './TibetanText.style';

class TibetanText extends Component {

  render () {
    const props = Object.assign({style: styles.font}, this.props);
    return <Text {...props} />
  }
}

export default TibetanText;
