'use strict';

import React, { Component, Navigator, PropTypes, View } from 'react-native';

import { connect } from 'react-redux/native';
import * as mainActions from '../actions/mainActions';
import { MasterView } from '../containers';
import { bindActionCreators } from 'redux';
import { Spinner } from 'react-native-icons';

import shouldPureComponentUpdate from 'react-pure-render/function';

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
    this.props.dispatch(mainActions.openDb('jiangkangyur'));
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {

    let settings = this.props.settings.toObject();
    let {db} = settings;

    let navigatorProps = {
      style: styles.navigatorIos,
      initialRoute: {
        index: 0
      },
      renderScene: this.renderScene.bind(this, settings)
    };

    if (db) {
      return (
        <Navigator {...navigatorProps} />
      );
    }

    let spinnerProps = {
      name: 'ion|load-c',
      size: 24,
      color: '#777',
      style: styles.stylesSpinner
    };

    return (
      <View style={styles.viewSpinner}>
        <Spinner {...spinnerProps} />
      </View>
    );
  }

  renderScene(settings, route, navigator) {

    const {dispatch} = this.props;
    const actions = bindActionCreators(mainActions, dispatch);

    let masterViewProps = Object.assign({settings}, actions);

    return (
      <MasterView {...masterViewProps}></MasterView>
    );
  }
}

export default MainApp;
