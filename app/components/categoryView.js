'use strict';

import React, { Component, ListView, PropTypes, Text, View } from 'react-native';

import kse from 'ksana-search';
import { styles } from './categoryView.style';

class CategoryView extends Component {

  static PropTypes = {
    db: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  };

  componentDidMount() {
    this._rows = [];
    this.setState({
      dataSource: this.getDataSource([1, 2, 3])
    });
  }

  getDataSource(rows) {
    this._rows = this._rows.concat(rows);
    return this.state.dataSource.cloneWithRows(this._rows);
  }

  renderRow(row) {
    return (
      <View>
        <Text>{row}</Text>
      </View>
    );
  }

  onEndReached() {
    console.log('onEndReached');
  }

  render() {

    let listViewProps = {
      dataSource: this.state.dataSource,
      renderRow: this.renderRow.bind(this),
      onEndReached: this.onEndReached.bind(this)
    };

    return (
      <View style={styles.container}>
        <Text>Test</Text>
        <ListView {...listViewProps} />
      </View>
    );
  }
}

export default CategoryView;
