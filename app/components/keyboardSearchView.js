'use strict';

import React, { Component, PropTypes, ListView, View, Text, TextInput, TouchableHighlight } from 'react-native';
import { styles } from './keyboardSearchView.style';
import { SearchResult } from '.';

import kse from 'ksana-search';

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

let tips = ds.cloneWithRows([
  'Wildcards: ? * ? match single unknown syllable:',
  'e.g: bde ? snying 1 syllable in between',
  'e.g: མི་2?་པ 2 syllables in between',
  '* match a range of unknown syllables:',
  'e.g: mi 5* pa 1 to 5 syllables in between'
]);

class KeyboardSearchView extends Component {

  static PropTypes = {
    db: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  state = {
    excerpts: [],
    keyword: '',
    text: '',
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  };

  componentDidMount() {
    this._rows = [];
    this.setState({
      dataSource: this.getDataSource(this.rows)
    });
  }

  getDataSource = rows => {
    this._rows = this._rows.concat(rows);
    return this.state.dataSource.cloneWithRows(this._rows);
  }

  onSearchInputChange(keyword) {
    this.setState({keyword});
    this.search(keyword);
  }

  onSearchInputSubmit() {
    this.search(this.state.keyword);
  }

  search(keyword) {

    let {db} = this.props;
    let self = this;

    var options = {
      nohighlight: true,
      range: {
        maxhit: 10
      }
    };

    kse.search(db, keyword, options, function(err, data) {

      self.setState({
        excerpts: data.excerpt || [],
        text: ''
      });
    });
  }

  renderTips() {
    if (! this.state.keyword) {
      return (
        <ListView dataSource={tips} renderRow={(row) => <Text>{row}</Text>}></ListView>
      );
    }
  }

  onRowClicked = row => {
  }

  renderRow = row => {

    return (
      <TouchableHighlight onPress={this.onRowClicked.bind(this, row)}>
        <View>
          <Text>123</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {

    let {keyword, text} = this.state;

    let textInputProps = {
      autoFocus: true,
      onChangeText: this.onSearchInputChange.bind(this),
      onEndEditing: this.onSearchInputSubmit.bind(this),
      placeholder: 'Search Keyword',
      ref: 'keyword',
      style: styles.input,
      value: keyword
    };

    let listViewProps = {
      dataSource: this.state.dataSource,
      renderRow: this.renderRow,
      onEndReached: this.onEndReached
    };

    return (
      <View style={styles.container}>
        <TextInput {...textInputProps} />
        {this.renderTips()}
        <ListView {...listViewProps} />
      </View>
    );
  }
}

export default KeyboardSearchView;
