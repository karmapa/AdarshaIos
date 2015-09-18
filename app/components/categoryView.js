'use strict';

import React, { Component, PropTypes, View } from 'react-native';

import kse from 'ksana-search';

class CategoryView extends Component {

  static PropTypes = {
    db: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <View>
      </View>
    );
  }
}

export default CategoryView;
