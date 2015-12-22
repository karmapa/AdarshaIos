'use strict';

import _ from 'lodash';
import React, {Component, PropTypes, ListView, ScrollView, View, Text, TextInput, TouchableHighlight} from 'react-native';
import {styles} from './keyboardSearchView.style';
import {values} from '../styles/global.style';
import {search, setKeyword} from '../modules/keyboardSearch';
import {connect} from 'react-redux/native';
import {highlight, fetch, getUti, renderSpinner} from '../helpers';

const TRIM_POS = 20;

@connect(state => ({
  excerpts: state.keyboardSearch.get('excerpts'),
  keyword: state.keyboardSearch.get('keyword'),
  loading: state.keyboardSearch.get('loading')
}), {search, setKeyword})
class KeyboardSearchView extends Component {

  static PropTypes = {
    excerpts: PropTypes.array.isRequired,
    keyword: PropTypes.string.isRequired,
    navigator: PropTypes.array.isRequired,
    search: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    setKeyword: PropTypes.func.isRequired
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
    this.setRows(this.props.excerpts);
  }

  componentWillReceiveProps(nextProps) {
    this.setRows(nextProps.excerpts);
  }

  setRows = rows => {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(rows)
    });
  }

  onSearchInputChange = keyword => {
    this.props.setKeyword(keyword);
    this.search(keyword);
  }

  search = keyword => {
    this.props.search(keyword);
  }

  renderTips() {
    if (_.isEmpty(this.props.excerpts)) {
      return (
        <View style={styles.tips}>
          <Text>Wildcards: ? * ? match single unknown syllable:</Text>
          <Text>e.g: bde ? snying 1 syllable in between</Text>
          <Text>e.g: མི་2?་པ 2 syllables in between</Text>
          <Text>* match a range of unknown syllables:</Text>
          <Text>e.g: mi 5* pa 1 to 5 syllables in between</Text>
        </View>
      );
    }
  }

  onRowClicked = row => {
    this.props.navigator.push({
      name: 'DetailView',
      fetchTitle: true,
      rows: [row]
    });
  }

  renderText = row => {

    let [text, hits] = this.trimByHit(row.text, row.realHits);
    let children = highlight(text, hits);

    return <Text style={{flex: 1}} numberOfLines={2} children={children} />;
  }

  trimByHit = (text, hits) => {

    let firstHit = _.first(hits);

    if (! firstHit) {
      return [text, hits];
    }

    let [start] = firstHit;

    if (start > TRIM_POS) {
      let delta = start - (TRIM_POS / 2);
      text = '…' + text.substring(delta);
      hits = hits.map(hit => {
        let [start, length, nWord] = hit;
        return [start - delta + 1, length, nWord];
      })
    }

    return [text, hits];
  }

  renderRow = row => {

    return (
      <TouchableHighlight onPress={this.onRowClicked.bind(this, row)} underlayColor={values.underlayColor}>
        <View style={styles.row}>
          <Text style={styles.uti}>{getUti(row)}</Text>
          {this.renderText(row)}
        </View>
      </TouchableHighlight>
    );
  }

  render() {

    let {loading} = this.props;

    let textInputProps = {
      autoCorrect: false,
      autoCapitalize: 'none',
      onChangeText: this.onSearchInputChange,
      placeholder: 'Search Keyword',
      ref: 'keyword',
      style: styles.input,
      value: this.props.keyword
    };

    let listViewProps = {
      pageSize: 12,
      dataSource: this.state.dataSource,
      renderRow: this.renderRow,
      onEndReached: this.onEndReached
    };

    return (
      <View style={styles.container}>
        <TextInput {...textInputProps} />
        {loading && renderSpinner()}
        {(! loading) && this.renderTips()}
        {(! loading) && <ListView {...listViewProps} />}
      </View>
    );
  }
}

export default KeyboardSearchView;
