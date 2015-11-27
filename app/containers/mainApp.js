'use strict';

import React, { Component, Navigator, PropTypes, View } from 'react-native';

import { connect } from 'react-redux/native';
import * as mainActions from '../actions/mainActions';
import { DetailView, MasterView } from '../containers';
import { CategoryView } from '../components';
import { bindActionCreators } from 'redux';
import { Spinner } from 'react-native-icons';
import { DB_NAME } from '../constants/AppConstants';

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
    let {dispatch} = this.props;
    dispatch(mainActions.openDb(DB_NAME));
    dispatch(mainActions.openToc(DB_NAME));
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {

    let settings = this.props.settings.toObject();
    let {db, tocRows} = settings;

    let navigatorProps = {
      style: styles.navigatorIos,
      initialRoute: {
        index: 0
      },
      renderScene: this.renderScene.bind(this, settings)
    };

    if (db && tocRows) {
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

    if ('DetailView' === route.name) {

      let detailViewProps = {
        settings,
        navigator,
        route,
        setFontSize: actions.setFontSize,
        setLineHeight: actions.setLineHeight,
        text: route.text,
        title: route.title,
        uti: route.uti
      };

      return (
        <DetailView {...detailViewProps} />
      );
    }

    if ('CategoryView' === route.name) {
      return (
        <CategoryView title={route.title} navigator={navigator} tocRows={route.tocRows} route={route} />
      );
    }

    let masterViewProps = Object.assign({
      settings,
      navigator,
      route
    }, actions);

    return (
      <MasterView {...masterViewProps}></MasterView>
    );
  }
}

export default MainApp;
