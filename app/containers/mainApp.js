'use strict';

import React, { Component, Navigator, PropTypes } from 'react-native';

import { connect } from 'react-redux/native';
import * as mainActions from '../actions/mainActions';
import { MasterView } from '../containers';
import { bindActionCreators } from 'redux';

import { styles } from './mainApp.style';

@connect(state => ({
  settings: state.main
}))
class MainApp extends Component {

  static PropTypes = {
    state: PropTypes.object.isRequire,
    dispatch: PropTypes.func.isRequire
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(mainActions.openDb('moedict'));
  }


  render() {

    let navigatorProps = {
      style: styles.navigatorIos,
      initialRoute: {
        index: 0
      },
      renderScene: this.renderScene.bind(this)
    };

    return (
      <Navigator {...navigatorProps} />
    );
  }

  renderScene(route, navigator) {

    const {settings, dispatch} = this.props;
    const actions = bindActionCreators(mainActions, dispatch);

    let masterViewProps = Object.assign({
      settings: settings.toObject()
    }, actions);

    return (
      <MasterView {...masterViewProps}></MasterView>
    );
  }
}

export default MainApp;
