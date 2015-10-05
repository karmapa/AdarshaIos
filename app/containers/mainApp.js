'use strict';

import React, { Component, Navigator, PropTypes, View } from 'react-native';

import { connect } from 'react-redux/native';
import * as mainActions from '../actions/mainActions';
import { DetailView, MasterView } from '../containers';
import { bindActionCreators } from 'redux';
import { Spinner } from 'react-native-icons';

import shouldPureComponentUpdate from 'react-pure-render/function';

import ksa from 'ksana-simple-api';

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

    let options = {
      db: 'jiangkangyur'
    };
    ksa.toc(options, (err, res) => {
      console.log('res', res);
    });
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

    if ('DetailView' === route.name) {
      let title = 'བོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པ';
      let text = 'བོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་' +
       'བོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པ' +
       'བོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོད་པབོ' ;

      let detailViewProps = {
        navigator,
        route,
        text,
        title
      };

      return (
        <DetailView {...detailViewProps} />
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
