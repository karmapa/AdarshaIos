'use strict';

import React, { Component, ListView, PropTypes, Text, View, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-icons';

import kse from 'ksana-search';
import { styles } from './categoryView.style';
import _ from 'lodash';

class CategoryView extends Component {

  static PropTypes = {
    tocRows: PropTypes.object.isRequired,
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

  tocRows = [];

  componentDidMount() {
    this.setTocRows(this.props.tocRows);
    this._rows = [];
    this.setState({
      dataSource: this.getDataSource(this.tocRows)
    });
  }

  setTocRows = (tocRows = []) => {
    this.tocRows = tocRows;
  }

  getDataSource = (rows) => {
    this._rows = this._rows.concat(rows);
    return this.state.dataSource.cloneWithRows(this._rows);
  }

  onRowClicked(row) {
    this.props.navigator.push({
      name: 'DetailView',
      index: this.props.route.index + 1
    });
  }

  renderRow = row => {

    let text = row.t;
    let depth = row.d;
    let next = row.n;
    let vpos = row.vpos;

    return (
      <TouchableHighlight key={row.index} style={styles.rowContainer} underlayColor={'#cccccc'} onPress={this.onRowClicked.bind(this, row)}>
        <View style={styles.rowView}>
          <Text style={{paddingLeft: 14, height: 32}}>{text}</Text>
          <Icon name="ion|chevron-right" style={{width: 16, height: 16, marginTop: 4, marginRight: 10}} size={16} color={'#555555'} />
        </View>
      </TouchableHighlight>
    );
  }

  onEndReached = () => {
    console.log('onEndReached');
  }

  render() {

    let listViewProps = {
      dataSource: this.state.dataSource,
      renderRow: this.renderRow,
      onEndReached: this.onEndReached
    };

    return (
      <View style={styles.container}>
        <ListView {...listViewProps} />
      </View>
    );
  }
}

export default CategoryView;
