'use strict';

import React, { Component, ListView, PropTypes, Text, View, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-icons';

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
      dataSource: this.getDataSource([
        'སྲིད་གསུམ་འགྲོ་ལ་རབ་དགའ་སར་པའི་ད',
        'སྲིད་སར་པའི་ད',
        'སྲིད་གསུམ་འགྲོ'
      ])
    });
  }

  getDataSource(rows) {
    this._rows = this._rows.concat(rows);
    return this.state.dataSource.cloneWithRows(this._rows);
  }

  renderRow(row) {
    return (
      <TouchableHighlight style={styles.rowContainer}>
        <View style={styles.rowView}>
          <Text style={{paddingLeft: 14, height: 32}}>{row}</Text>
          <Icon name="ion|chevron-right" style={{width: 32, height: 32, marginRight: 10}} size={32} color={'#000000'} />
        </View>
      </TouchableHighlight>
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
