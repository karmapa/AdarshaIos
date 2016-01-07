import React, {Text, Component, PropTypes} from 'react-native';
import {styles} from './TibetanText.style';

class TibetanText extends Component {

  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  render () {
    const props = Object.assign(this.props, {style: styles.font});
    return <Text ref={component => this._root = component} {...props} />
  }
}

export default TibetanText;
