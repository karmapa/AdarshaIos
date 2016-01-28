import _ from 'lodash';
import React, {Component, PropTypes, ListView, ScrollView, View, TextInput, TouchableHighlight} from 'react-native';
import {styles} from './KeyboardSearchView.style';
import {values} from '../styles/global.style';
import {search, setKeyword, loadMore} from '../modules/keyboardSearch';
import {connect} from 'react-redux/native';
import {cleanKeyword, highlight, getUti, renderSpinner} from '../helpers';
import {TibetanText} from '.';

const TRIM_POS = 20;
const TOP_AND_BOTTOM_SPACE = 150;

@connect(state => ({
  excerpts: state.keyboardSearch.get('excerptData').rows,
  isAppend: state.keyboardSearch.get('excerptData').isAppend,
  keyword: state.keyboardSearch.get('keyword'),
  lastKeyword: state.keyboardSearch.get('excerptData').keyword,
  isLoading: state.keyboardSearch.get('isLoading'),
  isLoadingMore: state.keyboardSearch.get('isLoadingMore'),
  utiSets: state.keyboardSearch.get('excerptData').utiSets,
  orientation: state.main.get('orientation'),
  deviceWidth: state.main.get('deviceWidth'),
  deviceHeight: state.main.get('deviceHeight')
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
    orientation: PropTypes.string.isRequired,
    deviceWidth: PropTypes.number.isRequired,
    deviceHeight: PropTypes.number.isRequired,
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

  getScrollViewHeight = () => {

    const {orientation, deviceWidth, deviceHeight} = this.props;

    if ('LANDSCAPE' === orientation) {
      return deviceWidth - TOP_AND_BOTTOM_SPACE;
    }
    return deviceHeight - TOP_AND_BOTTOM_SPACE;
  };

  renderTips() {
    if (_.isEmpty(this.props.excerpts)) {
      return (
        <View style={{height: this.getScrollViewHeight()}}>
          <ScrollView automaticallyAdjustContentInsets={false}>
            <View style={{paddingTop: 14}}>
              <TibetanText style={styles.heading}>Searching with Wildcards</TibetanText>
              <TibetanText>You can use wildcard characters to search ADARSHA when you know the beginning and ending of a phrase but not the syllables in between. There are two wildcards: the period (.) and the asterisk (*).</TibetanText>
              <TibetanText>Use the period when you know the exact number of syllables you want to search for. Type “.” (period) to search for one syllable in between, “.2” (period-2) to search for two syllables in  between, “.3” (period-3) to search for three syllables in between, and so forth.</TibetanText>
              <TibetanText>For example, searching for རྫོགས.སངས (rdzogs.sangs) will return phrases such as:</TibetanText>
              <TibetanText>རྫོགས་པའི་སངས་,</TibetanText>
              <TibetanText>རྫོགས་པར་སངས་, and so forth.</TibetanText>
              <TibetanText>
                <TibetanText>If you want to search for two syllables in between, type .2 (period-2). For example, རྫོགས</TibetanText>
                <TibetanText style={styles.danger}>.2</TibetanText>
                <TibetanText>སངས (rdzogs</TibetanText>
                <TibetanText style={styles.danger}>.2</TibetanText>
                <TibetanText>sangs) will return:</TibetanText>
              </TibetanText>
              <TibetanText>རྫོགས་པར། །རྫོགས་སངས,</TibetanText>
              <TibetanText>རྫོགས། །ངས་ནི་སངས, and so forth.</TibetanText>
              <TibetanText>Use the * (asterisk) when you do not know the exact number of syllables in between. Type * (asterisk) when there might be up to one syllable in between — that is, no syllable or one syllable. Type *2 to search for up to two syllables in between, *3 to search for up to three syllables in between, and so forth.</TibetanText>
              <TibetanText>For example, searching for རྫོགས*སངས (rdzogs*sangs) will return results with either no syllable  in between or one syllable in between, such as:</TibetanText>
              <TibetanText>རྫོགས་སངས་,</TibetanText>
              <TibetanText>རྫོགས་པའི་སངས་,</TibetanText>
              <TibetanText>རྫོགས་པར་སངས་, and so forth.</TibetanText>
              <TibetanText>
                <TibetanText>Searching for ཡང*2སངས་ (yang</TibetanText>
                <TibetanText style={styles.danger}>*2</TibetanText>
                <TibetanText>sangs) will return:</TibetanText>
              </TibetanText>
              <TibetanText>ཡང་སངས་,</TibetanText>
              <TibetanText>ཡང་དག་སངས་,</TibetanText>
              <TibetanText>ཡང་རང་སངས་,</TibetanText>
              <TibetanText>ཡང་འདིས་རང་སངས་, and so forth.</TibetanText>
              <TibetanText>
                <TibetanText>Searching for ཡང</TibetanText>
                <TibetanText style={styles.danger}>*3</TibetanText>
                <TibetanText>སངས་ will return all those same results plus:</TibetanText>
              </TibetanText>
              <TibetanText>ཡང་དག་རྫོགས་པའི་སངས་,</TibetanText>
              <TibetanText>ཡང་བལང་བར་བྱའོ། །སངས་,</TibetanText>
              <TibetanText>ཡང་དེ་དག་ནི་སངས་, and so forth.</TibetanText>
            </View>
          </ScrollView>
        </View>
      );
    }
  }

  onRowClicked = row => {
    this.props.navigator.push({
      name: 'DetailView',
      keyword: this.props.keyword,
      rows: [row]
    });
  };

  renderText = row => {

    let [text, hits] = this.trimByHit(row.text, row.hits);
    let children = highlight(text, hits, (key, str, style) => {
      if (str) {
        str = str.trim();
      }
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

    let {isLoading, orientation, deviceWidth, deviceHeight} = this.props;

    let textInputProps = {
      autoCorrect: false,
      autoCapitalize: 'none',
      onChangeText: this.onSearchInputChange,
      placeholder: 'Search Keyword',
      ref: 'keyword',
      style: styles.input,
      value: this.props.keyword
    };

    let windowHeight = ('LANDSCAPE' === orientation) ? deviceWidth : deviceHeight;

    let listViewProps = {
      pageSize: 7,
      initialListSize: 7,
      onRenderAheadDistance: windowHeight * 3,
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
