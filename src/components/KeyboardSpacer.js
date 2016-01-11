import React, {Animated, Component, PropTypes, View, Platform} from 'react-native';
import {connect} from 'react-redux/native';

const KITKAT = 19;

@connect(state => ({
  keyboardHeight: state.main.get('keyboardHeight')
}))
class KeyboardSpacer extends Component {

  static PropTypes = {
    keyboardHeight: PropTypes.number.isRequired
  };

  state = {
    keyboardHeightAnim: new Animated.Value(0)
  };

  componentWillReceiveProps(nextProps) {
    this.setKeyboardHeight(nextProps.keyboardHeight);
  }

  setKeyboardHeight = height => {
    Animated.timing(this.state.keyboardHeightAnim, {
      toValue: height,
      duration: 80
    }).start();
  };

  render() {
    return <Animated.View style={{height: this.state.keyboardHeightAnim}} />;
  }
}

export default ('android' === Platform) && (Platform.Version < KITKAT) ? View : KeyboardSpacer;
