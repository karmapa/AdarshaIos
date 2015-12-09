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
    text: ''
  };

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
      console.log('data.exerpts', data.excerpt);
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

  render() {

    let {excerpts, keyword, text} = this.state;

    let textInputProps = {
      autoFocus: true,
      onChangeText: this.onSearchInputChange.bind(this),
      onEndEditing: this.onSearchInputSubmit.bind(this),
      placeholder: 'Search Keyword',
      ref: 'keyword',
      style: styles.input,
      value: keyword
    };

    let searchResultProps = {
      excerpts
    };

    return (
      <View style={styles.container}>
        <TextInput {...textInputProps} />
        {this.renderTips()}
        <SearchResult {...searchResultProps} />
      </View>
    );
  }
}

export default KeyboardSearchView;
