import _ from 'lodash';
import React, {Component, PropTypes, ListView, View, TextInput, TouchableHighlight, Dimensions} from 'react-native';
import {styles} from './KeyboardSearchView.style';
import {values} from '../styles/global.style';
import {search, setKeyword, loadMore} from '../modules/keyboardSearch';
import {connect} from 'react-redux/native';
import {cleanKeyword, highlight, getUti, renderSpinner} from '../helpers';
import {TibetanText} from '.';

const TRIM_POS = 20;

@connect(state => ({
  excerpts: state.keyboardSearch.get('excerptData').rows,
  isAppend: state.keyboardSearch.get('excerptData').isAppend,
  keyword: state.keyboardSearch.get('keyword'),
  lastKeyword: state.keyboardSearch.get('excerptData').keyword,
  isLoading: state.keyboardSearch.get('isLoading'),
  isLoadingMore: state.keyboardSearch.get('isLoadingMore'),
  utiSets: state.keyboardSearch.get('excerptData').utiSets
}), {search, setKeyword, loadMore})
class KeyboardSearchView extends Component {

  static PropTypes = {
    excerpts: PropTypes.array.isRequired,
    isAppend: PropTypes.bool.isRequired,
    keyword: PropTypes.string.isRequired,
    lastKeyword: PropTypes.string.isRequired,
    loadMore: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoadingMore: PropTypes.bool.isRequired,
    navigator: PropTypes.array.isRequired,
    search: PropTypes.func.isRequired,
    setKeyword: PropTypes.func.isRequired,
    utiSets: PropTypes.func.isRequired
  };

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  };

  componentDidMount() {
    this.setRows(this.props.excerpts);
  }

  componentWillReceiveProps(nextProps) {

    let {keyword, lastKeyword, excerpts, isLoading, isLoadingMore} = nextProps;

    if (isLoading || isLoadingMore) {
      return;
    }

    if (cleanKeyword(keyword) === lastKeyword) {

      if (nextProps.isAppend) {
        this.appendRows(excerpts);
      }
      else {
        this.setRows(excerpts);
      }
    }
  }

  setRows = rows => {
    this.rows = rows;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.rows)
    });
  };

  appendRows = rows => {
    this.rows = this.rows.concat(rows);
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.rows)
    });
  };

  onSearchInputChange = keyword => {
    this.props.setKeyword(keyword);
    this.search(keyword);
  };

  search = _.debounce(keyword => {
    keyword = cleanKeyword(keyword);
    this.props.search(keyword);
  }, 500);

  renderTips() {
    if (_.isEmpty(this.props.excerpts)) {
      return (
        <View style={styles.tips}>
          <TibetanText>Wildcards: ? * ? match single unknown syllable:</TibetanText>
          <TibetanText>e.g: bde ? snying 1 syllable in between</TibetanText>
          <TibetanText>e.g: མི་2?་པ 2 syllables in between</TibetanText>
          <TibetanText>* match a range of unknown syllables:</TibetanText>
          <TibetanText>e.g: mi 5* pa 1 to 5 syllables in between</TibetanText>
        </View>
      );
    }
  }

  onRowClicked = row => {
    this.props.navigator.push({
      name: 'DetailView',
      rows: [row]
    });
  };

  renderText = row => {

    let [text, hits] = this.trimByHit(row.text, row.hits);
    let children = highlight(text, hits, (key, str, style) => {
      if (style) {
        return <TibetanText style={style} key={key}>{str}</TibetanText>;
      }
      return <TibetanText key={key}>{str}</TibetanText>;
    });

    return <TibetanText style={{flex: 1}} numberOfLines={2} children={children} />;
  };

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
      });
    }

    return [text, hits];
  };

  renderFooter = () => {
    if (this.props.isLoadingMore) {
      return renderSpinner();
    }
  };

  renderRow = row => {

    return (
      <TouchableHighlight onPress={this.onRowClicked.bind(this, row)} underlayColor={values.underlayColor}>
        <View style={styles.row}>
          <TibetanText style={styles.uti}>{getUti(row)}</TibetanText>
          {this.renderText(row)}
        </View>
      </TouchableHighlight>
    );
  };

  onEndReached = () => {
    let {keyword, lastKeyword, utiSets} = this.props;
    if ((cleanKeyword(keyword) === lastKeyword) && (utiSets.length > 0)) {
      this.props.loadMore(lastKeyword, utiSets);
    }
  };

  render() {

    let {isLoading} = this.props;

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
      pageSize: 7,
      initialListSize: 7,
      onRenderAheadDistance: Dimensions.get('window').height * 3,
      dataSource: this.state.dataSource,
      renderRow: this.renderRow,
      renderFooter: this.renderFooter,
      onEndReached: this.onEndReached
    };

    return (
      <View style={styles.container}>
        <TextInput {...textInputProps} />
        {isLoading && renderSpinner()}
        {(! isLoading) && this.renderTips()}
        {(! isLoading) && <ListView {...listViewProps} />}
      </View>
    );
  }
}

export default KeyboardSearchView;
