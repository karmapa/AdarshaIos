'use strict';

import React, { Component, Navigator, PropTypes, View } from 'react-native';

import { connect } from 'react-redux/native';
import * as mainActions from '../actions/mainActions';
import * as advanceSearchActions from '../actions/advanceSearchActions';
import { DetailView, MasterView } from '../containers';
import { CategoryView } from '../components';
import { bindActionCreators } from 'redux';
import { Spinner } from 'react-native-icons';
import { DB_NAME } from '../constants/AppConstants';

import shouldPureComponentUpdate from 'react-pure-render/function';

import { styles } from './mainApp.style';

@connect(state => ({
  settings: state.main,
  advanceSearchSettings: state.advanceSearch
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
    let advanceSearchSettings = this.props.advanceSearchSettings.toObject();
    let {db, tocRows} = settings;

    let navigatorProps = {
      style: styles.navigatorIos,
      initialRoute: {
        index: 0
      },
      renderScene: this.renderScene.bind(this, settings, advanceSearchSettings)
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

  renderScene(settings, advanceSearchSettings, route, navigator) {

    const {dispatch} = this.props;
    const bindedMainActions = bindActionCreators(mainActions, dispatch);
    const bindedAdvanceSearchActions = bindActionCreators(advanceSearchActions, dispatch);

    if ('DetailView' === route.name) {

      let detailViewProps = {
        settings,
        navigator,
        route,
        setFontSize: bindedMainActions.setFontSize,
        setLineHeight: bindedMainActions.setLineHeight,
        setWylieStatus: bindedMainActions.setWylieStatus,
        title: route.title,
        rows: route.rows,
        message: route.message
      };

      return (
        <DetailView {...detailViewProps} />
      );
    }

    let masterViewProps = Object.assign({
      settings,
      advanceSearchSettings,
      navigator,
      route
    }, bindedMainActions, bindedAdvanceSearchActions);

    return (
      <MasterView {...masterViewProps}></MasterView>
    );
  }
}

export default MainApp;
