import React, {Animated, Component, DeviceEventEmitter, PropTypes, View, Platform} from 'react-native';

const KITKAT = 19;

class KeyboardSpacer extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    keyboardHeightAnim: new Animated.Value(0)
  };

  componentWillMount() {
    this._registerEvents();
  }

  componentWillUnmount() {
    this._unRegisterEvents();
  }

  _registerEvents() {
    this._keyboardDidShowSubscription = DeviceEventEmitter.addListener('keyboardDidShow', e => this._keyboardDidShow(e));
    this._keyboardDidHideSubscription = DeviceEventEmitter.addListener('keyboardDidHide', e => this._keyboardDidHide(e));
  };

  _unRegisterEvents = () => {
    this._keyboardDidShowSubscription.remove();
    this._keyboardDidHideSubscription.remove();
  };

  _keyboardDidShow = e => {
    Animated.timing(this.state.keyboardHeightAnim, {
      toValue: e.endCoordinates.height,
      duration: 80
    }).start();
  };

  _keyboardDidHide = () => {
    Animated.timing(this.state.keyboardHeightAnim, {
      toValue: 0,
      duration: 80
    }).start();
  };

  render() {
    return <Animated.View style={{height: this.state.keyboardHeightAnim}} />;
  }
}

export default ('android' === Platform) && (Platform.Version < KITKAT) ? View : KeyboardSpacer;
