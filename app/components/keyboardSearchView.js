'use strict';

import React, { Component, PropTypes, View, Text, TextInput, TouchableHighlight } from 'react-native';
import { styles } from './keyboardSearchView.style';
import { SearchResult } from '.';

import kse from 'ksana-search';

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

    if (! db) {
      return;
    }

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
