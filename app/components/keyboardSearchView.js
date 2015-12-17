'use strict';

import _ from 'lodash';
import React, {Component, PropTypes, ListView, View, Text, TextInput, TouchableHighlight} from 'react-native';
import {styles} from './keyboardSearchView.style';
import {values} from '../styles/global.style';
import {search, setKeyword} from '../modules/keyboardSearch';
import {connect} from 'react-redux/native';
import {highlight, fetch, getUti} from '../helpers';

const TRIM_POS = 20;

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

let tips = ds.cloneWithRows([
  'Wildcards: ? * ? match single unknown syllable:',
  'e.g: bde ? snying 1 syllable in between',
  'e.g: མི་2?་པ 2 syllables in between',
  '* match a range of unknown syllables:',
  'e.g: mi 5* pa 1 to 5 syllables in between'
]);

@connect(state => ({
  excerpts: state.keyboardSearch.get('excerpts'),
  keyword: state.keyboardSearch.get('keyword')
}), {search, setKeyword})
class KeyboardSearchView extends Component {

  static PropTypes = {
    excerpts: PropTypes.array.isRequired,
    keyword: PropTypes.string.isRequired,
    navigator: PropTypes.array.isRequired,
    search: PropTypes.func.isRequired,
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
      return <ListView style={{marginTop: 10}} dataSource={tips} renderRow={(row) => <Text>{row}</Text>}></ListView>;
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
        let [start, length] = hit;
        return [start - delta + 1, length];
      })
    }

    return [text, hits];
  }

  renderRow = row => {

    return (
      <TouchableHighlight onPress={this.onRowClicked.bind(this, row)} underlayColor={values.underlayColor}>
        <View style={{flex: 1, paddingTop: 7, paddingBottom: 7}}>
          <Text style={{color: '#57867e'}}>{getUti(row)}</Text>
          {this.renderText(row)}
        </View>
      </TouchableHighlight>
    );
  }

  render() {

    let textInputProps = {
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
        {this.renderTips()}
        <ListView {...listViewProps} />
      </View>
    );
  }
}

export default KeyboardSearchView;
