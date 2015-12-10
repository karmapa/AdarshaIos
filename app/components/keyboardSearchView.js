'use strict';

import _ from 'lodash';
import React, {Component, PropTypes, ListView, View, Text, TextInput, TouchableHighlight} from 'react-native';
import {styles} from './keyboardSearchView.style';
import {values} from '../styles/global.style';
import {search} from '../modules/keyboardSearch';
import {connect} from 'react-redux/native';

import kse from 'ksana-search';

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

let tips = ds.cloneWithRows([
  'Wildcards: ? * ? match single unknown syllable:',
  'e.g: bde ? snying 1 syllable in between',
  'e.g: མི་2?་པ 2 syllables in between',
  '* match a range of unknown syllables:',
  'e.g: mi 5* pa 1 to 5 syllables in between'
]);

@connect(state => ({excerpts: state.keyboardSearch.get('excerpts')}), {search})
class KeyboardSearchView extends Component {

  static PropTypes = {
    db: PropTypes.object.isRequired,
    search: PropTypes.func.isRequired,
    excerpts: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
  }

  state = {
    keyword: '',
    text: '',
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  };

  componentDidMount() {
    this._rows = [];
    this.setState({
      dataSource: this.getDataSource(this.props.excerpts)
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setRows(nextProps.excerpts);
  }

  setRows = rows => {
    this._rows = [];
    this.setState({
      dataSource: this.getDataSource(rows)
    });
  }

  getDataSource = rows => {
    this._rows = this._rows.concat(rows);
    return this.state.dataSource.cloneWithRows(this._rows);
  }

  onSearchInputChange = keyword => {
    this.setState({keyword});
    if (keyword) {
      this.search(keyword);
    }
    else {
      this.setRows([]);
    }
  }

  onSearchInputSubmit = () => {
    this.search(this.state.keyword);
  }

  search(keyword) {

    let {db} = this.props;
    let options = {
      nohighlight: true,
      range: {
        maxhit: 10
      }
    };
    this.props.search(db, keyword, options);
  }

  renderTips() {
    if (! this.state.keyword) {
      return (
        <ListView dataSource={tips} renderRow={(row) => <Text>{row}</Text>}></ListView>
      );
    }
  }

  onRowClicked = row => {
    console.log('row', row);
  }

  renderText = row => {
    return <Text style={{flex: 1}} numberOfLines={2} children={this.highlight(row.text, row.realHits)} />;
  }

  trimByHit = (text, hits) => {

    let firstHit = _.first(hits);

    if (! firstHit) {
      return text;
    }

    let [start] = firstHit;

    if (start > 20) {
      let delta = start - 10;
      text = text.substring(delta);
      hits = hits.map(hit => {
        let [start, length] = hit;
        return [start - delta, length];
      })
    }
    return [text, hits];
  }

  highlight(text, hits) {

    [text, hits] = this.trimByHit(text, hits);

    return hits.reduce((data, hit, index, arr) => {
      let {tags, pos} = data;
      let [start, length] = hit;
      if (start > pos) {
        tags.push(<Text key={pos}>{text.substring(pos, start)}</Text>);
      }
      tags.push(<Text key={'h' + pos} style={styles.highlight}>{text.substr(start, length)}</Text>);
      data.pos = start += length;
      if (index === (arr.length - 1)) {
        tags.push(<Text key={data.pos}>{text.substr(data.pos)}</Text>);
      }
      return data;
    }, {tags: [], pos: 0}).tags;
  }

  renderRow = row => {

    return (
      <TouchableHighlight style={{paddingTop: 7, paddingBottom: 7}} onPress={this.onRowClicked.bind(this, row)} underlayColor={values.underlayColor}>
        <View style={{flex: 1}}>
          <Text style={{color: '#57867e'}}>{row.segname}</Text>
          {this.renderText(row)}
        </View>
      </TouchableHighlight>
    );
  }

  render() {

    let {keyword, text} = this.state;

    let textInputProps = {
      autoFocus: true,
      onChangeText: this.onSearchInputChange,
      onEndEditing: this.onSearchInputSubmit,
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
