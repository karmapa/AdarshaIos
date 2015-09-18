'use strict';

import React, { Component, ScrollView, View, PropTypes } from 'react-native';

import { Spinner, Icon} from 'react-native-icons';
import { styles, stylesTabBar } from './detailView.style';
import shouldPureComponentUpdate from 'react-pure-render/function';

class DetailView extends Component {

  static PropTypes = {
  };

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {

    return (
      <View>
      </View>
    );
  }
}

export default DetailView;
