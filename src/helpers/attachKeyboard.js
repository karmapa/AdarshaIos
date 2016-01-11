import React, {Component, DeviceEventEmitter, PropTypes} from 'react-native';
import hoistStatics from 'hoist-non-react-statics';
import {setKeyboardHeight} from '../modules/main';
import {connect} from 'react-redux/native';

@connect(() => ({}), {setKeyboardHeight})
export default function attachKeyboard(Component) {
  class AttachKeyboard extends Component {

    static PropTypes = {
      setLoading: PropTypes.func.isRequired
    };

    componentWillMount() {
      this._registerEvents();
    }

    componentWillUnmount() {
      this._unRegisterEvents();
    }

    _registerEvents = () => {
      this._keyboardDidShowSubscription = DeviceEventEmitter.addListener('keyboardDidShow', e => this._keyboardDidShow(e));
      this._keyboardDidHideSubscription = DeviceEventEmitter.addListener('keyboardDidHide', e => this._keyboardDidHide(e));
    };

    _unRegisterEvents = () => {
      this._keyboardDidShowSubscription.remove();
      this._keyboardDidHideSubscription.remove();
    };

    _keyboardDidShow = e => this.props.setKeyboardHeight(e.endCoordinates.height);

    _keyboardDidHide = () => {
      this.props.setKeyboardHeight(0);
    };
  }

  return hoistStatics(AttachKeyboard, Component);
}
