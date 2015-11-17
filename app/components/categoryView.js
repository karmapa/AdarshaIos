'use strict';

import React, { Component, ListView, PropTypes, Text, View, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-icons';

import kse from 'ksana-search';
import { styles } from './categoryView.style';

class CategoryView extends Component {

  static PropTypes = {
    toc: PropTypes.object.isRequired,
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  };

  toc = [];

  componentDidMount() {
    this.setToc(this.props.toc);
    this._rows = [];
    this.setState({
      dataSource: this.getDataSource([
        'སྲིད་གསུམ་འགྲོ་ལ་རབ་དགའ་སར་པའི་ད',
        'སྲིད་སར་པའི་ད',
        'སྲིད་གསུམ་འགྲོ'
      ])
    });
  }

  setToc = (toc = []) => {
    this.toc = toc;
  }

  getDataSource(rows) {
    this._rows = this._rows.concat(rows);
    return this.state.dataSource.cloneWithRows(this._rows);
  }

  onRowClicked(row) {
    this.props.navigator.push({
      name: 'DetailView',
      index: this.props.route.index + 1
    });
  }

  renderRow(row) {
    return (
      <TouchableHighlight style={styles.rowContainer} underlayColor={'#cccccc'} onPress={this.onRowClicked.bind(this, row)}>
        <View style={styles.rowView}>
          <Text style={{paddingLeft: 14, height: 32}}>{row}</Text>
          <Icon name="ion|chevron-right" style={{width: 16, height: 16, marginTop: 4, marginRight: 10}} size={16} color={'#555555'} />
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
        <ListView {...listViewProps} />
      </View>
    );
  }
}

export default CategoryView;
