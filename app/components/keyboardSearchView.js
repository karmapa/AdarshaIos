'use strict';

import React, { Component, PropTypes, View, Text, TextInput, TouchableHighlight } from 'react-native';
import { styles } from './keyboardSearchView.style';
import { SearchResult } from '.';

class KeyboardSearchView extends Component {

  static PropTypes = {
  };

  constructor(props) {
    super(props);
  }

  state = {
    excerpts: [],
    keyword: ''
  };

  onSearchInputChange(keyword) {
    this.setState({keyword});
  }

  onSearchInputSubmit() {
    this.search(this.state.keyword);
  }

  search(keyword) {
  }

  render() {

    let {excerpts, keyword, text} = this.state;

    let textInputProps = {
      autoFocus: true,
      onChangeText: this.onSearchInputChange.bind(this),
      onEndEditing: this.onSearchInputSubmit.bind(this),
      placeholder: 'Search Keyword',
      ref: 'keyword',
      style: styles.searchInput,
      value: keyword
    };

    let searchResultProps = {
      excerpts
    };

    return (
      <View style={styles.view}>
        <TextInput {...textInputProps} />
        <SearchResult {...searchResultProps} />
      </View>
    );
  }
}

export default KeyboardSearchView;
