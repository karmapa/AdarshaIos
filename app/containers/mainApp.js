'use strict';

import React, { Component, PropTypes } from 'react-native';

import { connect } from 'react-redux/native';
import * as mainActions from '../actions/mainActions';
import { MasterView } from '../containers';
import { bindActionCreators } from 'redux';

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

    const {settings} = this.props;
    const appActions = bindActionCreators(mainActions, this.props.dispatch);

    let masterViewProps = {
      settings: settings.toObject(),
      ...appActions
    };

    return (
      <MasterView {...masterViewProps} />
    );
  }
}

export default MainApp;
