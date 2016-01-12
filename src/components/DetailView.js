import React, {ListView, Component, View, PropTypes, TextInput, Dimensions,
  TouchableHighlight, ScrollView, LayoutAnimation} from 'react-native';
import RefreshableListView from 'react-native-refreshable-listview';
import _ from 'lodash';
import shouldPureComponentUpdate from 'react-pure-render/function';
import wylie from 'tibetan/wylie';
import {Icon} from 'react-native-icons';
import {connect} from 'react-redux/native';
import {loadNext, loadPrev, renderSpinner, fetch, cleanKeyword} from '../helpers';
import {setSearchKeyword, setHasScrolled, setToolbarStatus, setSearchBarStatus, setLoading,
  setTitle, setMatchIndex, setUtis, setLoadingMore, setVisibleUti} from '../modules/detailView';
import {setSideMenuStatus} from '../modules/main';
import {styles} from './DetailView.style';
import {toc, getUti, highlight} from '../helpers';
import {values, styles as globalStyles} from '../styles/global.style';
import {Background, KeyboardSpacer, TibetanText} from '.';
import TimerMixin from 'react-timer-mixin';

const underlayColor = 'rgba(0, 0, 0, 0)';
const fontColor = '#ffffff';

const ZERO_WIDTH_SPACE = String.fromCharCode(parseInt('200B', 16));
const SETTINGS_PROPS = ['fontSize', 'lineHeight', 'wylieOn'];

const COLOR_YELLOW = '#f1c40f';
const COLOR_ORANGE = '#e67e22';

const LIST_VIEW = 'listView';

@connect(state => ({
  visibleUti: state.detailView.get('visibleUti'),
  fontSize: state.main.get('fontSize'),
  hasScrolled: state.detailView.get('hasScrolled'),
  isLoading: state.detailView.get('isLoading'),
  isLoadingMore: state.detailView.get('isLoadingMore'),
  keyword: state.keyboardSearch.get('keyword'),
  lineHeight: state.main.get('lineHeight'),
  matchIndex: state.detailView.get('matchIndex'),
  searchBarOn: state.detailView.get('searchBarOn'),
  searchKeyword: state.detailView.get('searchKeyword'),
  title: state.detailView.get('title'),
  toolbarOn: state.detailView.get('toolbarOn'),
  utis: state.detailView.get('utis'),
  wylieOn: state.main.get('wylieOn')
}), {setHasScrolled, setToolbarStatus, setSideMenuStatus, setSearchKeyword, setVisibleUti,
  setSearchBarStatus, setMatchIndex, setUtis, setLoadingMore, setLoading, setTitle})
class DetailView extends Component {

  static PropTypes = {
    fontSize: PropTypes.number.isRequired,
    hasScrolled: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoadingMore: PropTypes.bool.isRequired,
    keyword: PropTypes.string.isRequired,
    lineHeight: PropTypes.number.isRequired,
    matchIndex: PropTypes.number.isRequired,
    navigator: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    rows: PropTypes.array.isRequired,
    searchKeyword: PropTypes.string.isRequired,
    setHasScrolled: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setLoadingMore: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    setMatchIndex: PropTypes.func.isRequired,
    setSearchKeyword: PropTypes.func.isRequired,
    setVisibleUti: PropTypes.func.isRequired,
    setUtis: PropTypes.func.isRequired,
    title: PropTypes.string,
    toolbarOn: PropTypes.bool.isRequired,
    visibleUti: PropTypes.string.isRequired,
    utis: PropTypes.array.isRequired,
    wylieOn: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this._lastSearchKeyword = '';
    this._layoutData = {};
  }

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => this.isVisibleRow(row2)
    })
  };

  isVisibleRow = row => {
    return this.props.utis.includes(row.uti);
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  componentWillMount() {
    LayoutAnimation.spring();
  }

  componentWillReceiveProps(nextProps, nextState) {

    if (! _.isEqual(_.pick(this.props, SETTINGS_PROPS), _.pick(nextProps, SETTINGS_PROPS))) {
      this.rerenderListView();
    }
    else if (this.props.matchIndex !== nextProps.matchIndex) {
      this.rerenderListView();
    }
    else if (this.props.searchKeyword !== nextProps.searchKeyword) {
      this.highlightAsync(nextProps.searchKeyword);
    }
  }

  getVisibleRow = () => {
    let uti = this.props.visibleUti || _.get(_.first(this._rows), 'uti');
    return _.find(this._rows, {uti});
  };

  updateHitsByRows = (rows = [], newRows = []) => {
    newRows.forEach(newRow => {
      let row = _.find(rows, {uti: newRow.uti});
      if (row) {
        row.hits = newRow.hits;
      }
    });
    return rows;
  };

  highlightAsync = async searchKeyword => {

    let newRows = await fetch({uti: this.props.utis, q: cleanKeyword(searchKeyword)}) || [];
    this._rows = this.updateHitsByRows(this._rows, newRows);

    setMatchIndex(0);

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._rows)
    });
  };

  componentDidMount() {

    if (this.props.keyword) {
      this.props.setSearchKeyword(this.props.keyword);
    }

    this.isLoading = false;
    this.isLoadingTitle = false;
    this.lastOffsetY = 0;
    this.isScrolling = false;
    this.direction = null;

    TimerMixin.setTimeout(() => {
      this.preload()
        .then(() => {
          this.setVisibleUti();
        });
    });
  }

  preload = async (rows = this.props.rows) => {

    let {setLoading, isLoading} = this.props;
    let promises = [];

    if (! isLoading) {
      setLoading(true);
    }
    this._rows = rows;

    promises.push(this.loadNext());
    promises.push(this.fetchTitle());

    return Promise.all(promises)
      .then(() => {
        setLoading(false);
      });
  };

  fetchTitle = async () => {

    let row = _.first(this.props.rows);
    let uti = getUti(row);
    let data = await toc({uti});

    this.props.setTitle(_.get(data, 'breadcrumb[3].t'));
  };

  openSideMenu = () => {
    this.props.setSideMenuStatus(true);
  };

  getDataSource = (rows, append = true) => {
    if (append) {
      this._rows = this._rows.concat(rows);
    }
    else {
      this._rows = rows.concat(this._rows);
    }
    return this.state.dataSource.cloneWithRows(this._rows);
  };

  rerenderListView = () => {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._rows)
    });
  };

  goBack = () => {
    this.closeSearchInput();
    this.props.navigator.pop();
  };

  goHome = () => {
    this.props.navigator.popToTop();
  };

  renderText = row => {

    const {fontSize, lineHeight, wylieOn, matchIndex, searchBarOn, visibleUti} = this.props;
    const defaultStyle = {fontSize, lineHeight: lineHeight * fontSize};

    let text = row.text.replace(/\n/g, ZERO_WIDTH_SPACE);
    let highlightIndex = 0;

    let children = highlight(text, row.hits, (key, str, style) => {

      if (wylieOn) {
        str = wylie.toWylie(str);
      }
      if (style) {

        // default
        style = {backgroundColor: COLOR_YELLOW};

        if ((row.uti === visibleUti) && (highlightIndex === matchIndex) && searchBarOn) {
          // target
          style.backgroundColor = COLOR_ORANGE;
        }
        highlightIndex++;
        return <TibetanText style={style} key={key}>{str}</TibetanText>;
      }
      return <TibetanText key={key}>{str}</TibetanText>;
    });

    return <TibetanText style={defaultStyle} children={children} />;
  };

  handleRowLayout = (row, event) => {
    this._layoutData[row.uti] = event.nativeEvent.layout;
  };

  getRowKey = row => 'row-' + row.uti;

  renderRow = row => {
    return (
      <View key={this.getRowKey(row)} onLayout={this.handleRowLayout.bind(this, row)} style={{paddingLeft: 14, paddingRight: 14, marginBottom: 20}}>
        <View style={{borderColor: '#000000', borderBottomWidth: 1, paddingBottom: 14}}>
          <TibetanText>{getUti(row)}</TibetanText>
          {this.renderText(row)}
        </View>
      </View>
    );
  };

  onEndReached = () => {
    this.loadNext();
  };

  loadPrev = async () => {

    let firstRow = _.first(this._rows);
    let uti = getUti(firstRow);

    if (! uti) {
      return Promise.reject('uti is missing');
    }
    try {
      let rows = await loadPrev({count: 1, uti, q: cleanKeyword(this.props.searchKeyword)});
      this.setState({
        dataSource: this.getDataSource(rows, false)
      });
    }
    catch (e) {
      // uti not found
      console.log('loadPrev err', e);
    }
  };

  loadNext = async () => {

    let {isLoadingMore, setLoadingMore} = this.props;

    if (isLoadingMore) {
      return Promise.reject('isLoading');
    }

    setLoadingMore(true);

    let lastRow = _.last(this._rows);
    let uti = getUti(lastRow);

    if (! uti) {
      return Promise.reject('uti is missing');
    }

    let rows = await loadNext({count: 5, uti, q: cleanKeyword(this.props.searchKeyword)});

    this.setState({
      dataSource: this.getDataSource(rows)
    });
    setLoadingMore(false);
  };

  setToolbarStatus = toolbarOn => {
    LayoutAnimation.spring();
    this.props.setToolbarStatus(toolbarOn);

    if ((false === toolbarOn) && this.refs.searchInput) {
      this.refs.searchInput.blur();
      this.props.setSearchBarStatus(false);
    }
  };

  getAllUtis = () => {
    return _.pluck(this._rows, 'uti');
  };

  setVisibleUti = () => {

    let {utis} = this.props;
    let middle = this.lastOffsetY + (Dimensions.get('window').height / 2);

    let layoutRow = _.chain(utis)
      .map(uti => {
        const layout = this._layoutData[uti];
        return layout ? {uti, layout} : null;
      })
      .filter(_.isObject)
      .filter(row => {
        let {layout} = row;
        return (layout.y < middle) && (middle < (layout.y + layout.height));
      })
      .first()
      .value();

    let visibleUti = layoutRow ? layoutRow.uti : _.get(this._rows, '[0].uti');

    this.props.setVisibleUti(visibleUti);
  };

  updateTitle = _.debounce(async () => {
    let data = await toc({uti: this.props.visibleUti});
    this.props.setTitle(_.get(data, 'breadcrumb[3].t'));
  }, 100);

  handleScroll = event => {
    this.isScrolling = true;

    if (this.props.toolbarOn && this.props.hasScrolled && (! this.props.searchBarOn)) {
      this.setToolbarStatus(false);
    }

    if (this.props.searchBarOn && this.refs.searchInput) {
      this.refs.searchInput.blur();
    }

    let offsetY = _.get(event, 'nativeEvent.contentOffset.y');
    this.direction = offsetY > this.lastOffsetY ? 'down' : 'up';

    this.updateTitle();
    this.lastOffsetY = offsetY;
    this.props.setHasScrolled(true);
    this.setVisibleUti();
  };

  handlePress = () => {
    if (this.props.searchBarOn && this.refs.searchInput) {
      this.refs.searchInput.blur();
    }
    else {
      this.setToolbarStatus(! this.props.toolbarOn);
    }
  };

  handleTouchStart = () => {
    this.isScrolling = false;
  };

  handleTouchEnd = () => {
    if (! this.isScrolling) {
      this.handlePress();
    }
    this.isScrolling = false;
  };

  hasBiography = () => !! this.props.title;

  showBiography = () => {
    let {visibleUti} = this.props;
    if (visibleUti) {
      this.props.navigator.push({
        name: 'Biography',
        title: this.props.title,
        uti: visibleUti
      });
    }
  };

  onInputChange = searchKeyword => this.props.setSearchKeyword(searchKeyword);

  handleSubmit = () => this.setToolbarStatus(false);

  goTop = async () => {

    let {isLoading, setLoading, searchKeyword} = this.props;

    if (isLoading) {
      return;
    }

    setLoading(true);

    let rows;

    try {
      let data = await toc({uti: this.props.visibleUti});
      let vpos = _.get(data, 'breadcrumb[3].vpos');

      if (_.isUndefined(vpos)) {
        setLoading(false);
        return;
      }

      rows = await fetch({
        vpos,
        q: cleanKeyword(searchKeyword)
      });

    } catch(err) {
      console.log('goTop err:', err);
      setLoading(false);
      return;    // don't do anything
    }

    if (rows && (rows.length > 0)) {
      TimerMixin.setTimeout(() => {
        this.preload(rows);
      }, 0);
    }
  };

  showSearchInput = () => {

    if (this._lastSearchKeyword) {
      this.props.setSearchKeyword(this._lastSearchKeyword);
    }
    if (this.props.searchKeyword) {
      this.highlightAsync(this.props.searchKeyword);
    }
    this.props.setSearchBarStatus(true);
  };

  closeSearchInput = () => {
    this._lastSearchKeyword = this.props.searchKeyword;
    this.props.setSearchKeyword('');
    this.props.setSearchBarStatus(false);
  };

  getPreviousUti = () => {
    let {visibleUti, utis} = this.props;
    let utisWithHits = utis.filter(uti => _.get(_.find(this._rows, {uti}), 'hits', []).length > 0);
    let index = utisWithHits.indexOf(visibleUti);
    let notFound = -1 === index;
    let noNext = 0 === index;

    if (notFound || noNext) {
      return null;
    }
    return utisWithHits[index - 1];
  };

  getNextUti = () => {
    let {visibleUti, utis} = this.props;
    let utisWithHits = utis.filter(uti => _.get(_.find(this._rows, {uti}), 'hits', []).length > 0);
    let index = utisWithHits.indexOf(visibleUti);
    let notFound = -1 === index;
    let noNext = index === (utisWithHits.length - 1);

    if (notFound || noNext) {
      return null;
    }
    return utisWithHits[index + 1];
  };

  goPreviousKeyword = () => {

    let {matchIndex, setMatchIndex} = this.props;

    if (0 === matchIndex) {
      let previousUti = this.getPreviousUti();
      let previousRow = _.find(this._rows, {uti: previousUti});
      let layoutRow = this._layoutData[previousUti];
      if (layoutRow && previousRow) {
        setMatchIndex(previousRow.hits.length - 1);
        this.refs[LIST_VIEW].getScrollResponder().scrollTo(layoutRow.y);
      }
      return;
    }

    if (matchIndex > 0) {
      setMatchIndex(matchIndex - 1);
    }
  };

  goNextKeyword = () => {

    let {matchIndex, setMatchIndex} = this.props;
    let visibleRow = this.getVisibleRow();
    let lastIndex = _.get(visibleRow, 'hits', []).length - 1;

    if (lastIndex === matchIndex) {
      let nextUti = this.getNextUti();
      let layoutRow = this._layoutData[nextUti];

      if (layoutRow) {
        setMatchIndex(0);
        this.refs[LIST_VIEW].getScrollResponder().scrollTo(layoutRow.y);
      }
      return;
    }

    if (matchIndex < lastIndex) {
      setMatchIndex(matchIndex + 1);
    }
  };

  renderBiographyButton = () => {
    if (this.hasBiography()) {
      return (
        <TouchableHighlight onPress={this.showBiography} style={styles.bottomButton} underlayColor={underlayColor}>
          <Icon name="ion|document-text" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
        </TouchableHighlight>
      );
    }
  };

  renderBottomBarContent = () => {

    if (this.props.searchBarOn) {

      let inputProps = {
        ref: 'searchInput',
        autoCapitalize: 'none',
        autoFocus: true,
        autoCorrect: false,
        onChangeText: this.onInputChange,
        onSubmitEditing: this.handleSubmit,
        placeholder: 'Search in sutra',
        placeholderTextColor: 'rgba(0, 0, 0, 0.6)',
        style: styles.input,
        value: this.props.searchKeyword
      };

      return (
        <View style={styles.rows}>
          <TextInput {...inputProps} />
          <View style={[styles.rows, {flex: 2}]}>
            <TouchableHighlight onPress={this.goPreviousKeyword} style={styles.bottomButton} underlayColor={underlayColor}>
              <Icon name="ion|arrow-up-b" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
            </TouchableHighlight>
            <TouchableHighlight onPress={this.goNextKeyword} style={styles.bottomButton} underlayColor={underlayColor}>
              <Icon name="ion|arrow-down-b" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
            </TouchableHighlight>
            <TouchableHighlight onPress={this.closeSearchInput} style={styles.bottomButton} underlayColor={underlayColor}>
              <Icon name="ion|close-round" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
            </TouchableHighlight>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.rows}>
        <TouchableHighlight onPress={this.goHome} style={styles.bottomButton} underlayColor={underlayColor}>
          <Icon name="ion|home" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
        </TouchableHighlight>
        {this.renderBiographyButton()}
        <TouchableHighlight onPress={this.showSearchInput} style={styles.bottomButton} underlayColor={underlayColor}>
          <Icon name="fontawesome|search" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
        </TouchableHighlight>
        <TouchableHighlight onPress={this.openSideMenu} style={styles.bottomButton} underlayColor={underlayColor}>
          <Icon name="fontawesome|gear" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
        </TouchableHighlight>
      </View>
    );
  };

  getUpButtonBottom = () => {
    // height with search input and without search input are different
    return this.props.searchBarOn ? 77 : 50;
  };

  handleChangeVisibleRows = (visibleRows) => {

    let utis = Object.keys(_.get(visibleRows, 's1', {}))
      .map(index => this._rows[index])
      .filter(row => undefined !== row)
      .map(row => getUti(row));

    this.props.setUtis(utis);
  };

  renderFooter = () => {
    if (this.props.isLoadingMore) {
      return renderSpinner({transparent: true});
    }
  };

  renderContent = () => {

    let {toolbarOn, isLoading, title} = this.props;

    if (isLoading) {
      return renderSpinner({transparent: true});
    }

    let listViewProps = {
      dataSource: this.state.dataSource,
      onEndReached: this.onEndReached,
      pageSize: 1,
      ref: LIST_VIEW,
      renderRow: this.renderRow,
      renderAheadDistance: 2000,
      onEndReachedThreshold: 0,
      onChangeVisibleRows: this.handleChangeVisibleRows,
      renderFooter: this.renderFooter,
      renderScrollComponent: props => {

        let onScroll = props.onScroll;

        props.onScroll = (...args) => {
          onScroll.apply(null, args);
          this.handleScroll(...args);
        };
        props.scrollEventThrottle = 10;
        props.onTouchStart = this.handleTouchStart;
        props.onTouchEnd = this.handleTouchEnd;
        props.ref = scrollView => this._scrollView = scrollView;

        return <ScrollView {...props} />;
      },
      loadData: this.loadPrev
    };

    return (
      <View style={{flex: 1}}>
        <View style={[globalStyles.transparentContainer, {paddingTop: 20}]}>

          <View style={styles.container}>
            <RefreshableListView {...listViewProps} />
            <View style={[styles.nav, {top: toolbarOn ? 0 : -60}]}>
              <TouchableHighlight onPress={this.goBack} style={styles.navButton} underlayColor={underlayColor}>
                <Icon name="ion|chevron-left" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
              </TouchableHighlight>
              <TibetanText numberOfLines={1} style={styles.navTitle}>{title}</TibetanText>
            </View>
          </View>

          <View style={[styles.bottomBar, {bottom: toolbarOn ? 0 : -70}]}>
            {this.renderBottomBarContent()}
          </View>

          <TouchableHighlight onPress={this.goTop} style={[styles.upButton, {bottom: toolbarOn ? this.getUpButtonBottom() : -147}]} underlayColor={underlayColor}>
            <Icon name="fontawesome|arrow-up" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
          </TouchableHighlight>
        </View>

        <KeyboardSpacer />
      </View>
    );
  };

  render() {

    return (
      <View style={[globalStyles.transparentContainer, {paddingTop: 0}]}>
        <Background />
        {this.renderContent()}
      </View>
    );
  }
}

export default DetailView;
