import React, {ListView, Component, View, PropTypes, TextInput, Dimensions,
  TouchableHighlight, Image, ScrollView, LayoutAnimation} from 'react-native';
import RefreshableListView from 'react-native-refreshable-listview';
import _ from 'lodash';
import shouldPureComponentUpdate from 'react-pure-render/function';
import wylie from 'tibetan/wylie';
import {Icon} from 'react-native-icons';
import {connect} from 'react-redux/native';
import {loadNext, loadPrev, renderSpinner, fetch, cleanKeyword} from '../helpers';
import {setSearchKeyword, setHasScrolled, setToolbarStatus, setSearchBarStatus, setLoading,
  setMatchIndex, setUtis, setLoadingMore} from '../modules/detailView';
import {setSideMenuStatus} from '../modules/main';
import {styles} from './DetailView.style';
import {toc, getUti, highlight} from '../helpers';
import {values, styles as globalStyles} from '../styles/global.style';
import {KeyboardSpacer, TibetanText} from '.';
import TimerMixin from 'react-timer-mixin';

const underlayColor = 'rgba(0, 0, 0, 0)';
const fontColor = '#ffffff';

const ZERO_WIDTH_SPACE = String.fromCharCode(parseInt('200B', 16));
const SETTINGS_PROPS = ['fontSize', 'lineHeight', 'wylieOn'];

const LIST_VIEW = 'listView';

@connect(state => ({
  backgroundIndex: state.main.get('backgroundIndex'),
  hasScrolled: state.detailView.get('hasScrolled'),
  fontSize: state.main.get('fontSize'),
  lineHeight: state.main.get('lineHeight'),
  searchKeyword: state.detailView.get('searchKeyword'),
  isLoading: state.detailView.get('isLoading'),
  isLoadingMore: state.detailView.get('isLoadingMore'),
  matchIndex: state.detailView.get('matchIndex'),
  currentUti: state.detailView.get('currentUti'),
  toolbarOn: state.detailView.get('toolbarOn'),
  wylieOn: state.main.get('wylieOn'),
  keyword: state.keyboardSearch.get('keyword'),
  utis: state.detailView.get('utis'),
  searchBarOn: state.detailView.get('searchBarOn')
}), {setHasScrolled, setToolbarStatus, setSideMenuStatus, setSearchKeyword,
  setSearchBarStatus, setMatchIndex, setUtis, setLoadingMore, setLoading})
class DetailView extends Component {

  static PropTypes = {
    backgroundIndex: PropTypes.number.isRequired,
    fetchTitle: PropTypes.bool,
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
    setMatchIndex: PropTypes.func.isRequired,
    setSearchKeyword: PropTypes.func.isRequired,
    setUtis: PropTypes.func.isRequired,
    title: PropTypes.string,
    toolbarOn: PropTypes.bool.isRequired,
    utis: PropTypes.array.isRequired,
    wylieOn: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this._lastSearchKeyword = '';
    this._visibleUtiRow = null;
    this._rowsLayout = {};
  }

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    }),
    title: ''
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
    let uti = this.getVisibleUti() || _.get(_.first(this._rows), 'uti');
    return _.find(this._rows, {uti});
  };

  highlightAsync = async searchKeyword => {

    this._rows = await fetch({uti: this.props.utis, q: cleanKeyword(searchKeyword)}) || [];
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
    this.setTitle(this.props.title);
    TimerMixin.setTimeout(() => {
      this.preload();
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

    if (this.props.fetchTitle) {
      promises.push(this.fetchTitle());
    }
    return Promise.all(promises)
      .then(() => {
        setLoading(false);
      });
  };

  fetchTitle = async () => {

    let row = _.first(this.props.rows);
    let uti = getUti(row);
    let data = await toc({uti});

    this.setTitle(_.get(data, 'breadcrumb[3].t'));
  };

  openSideMenu = () => {
    this.props.setSideMenuStatus(true);
  };

  setTitle = title => this.setState({title});

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
    // workaround of forcing a ListView to update
    // https://github.com/facebook/react-native/issues/1133
    this._rows = JSON.parse(JSON.stringify(this._rows));
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

  handleTextLayout = event => {
    console.log('handleTextLayout', event.nativeEvent.layout);
  };

  renderText = row => {

    const {fontSize, lineHeight, wylieOn, matchIndex, searchBarOn} = this.props;
    const visibleUti = this.getVisibleUti();
    const defaultStyle = {fontSize, lineHeight: lineHeight * fontSize};

    let text = row.text.replace(/\n/g, ZERO_WIDTH_SPACE);
    let highlightIndex = 0;

    let children = highlight(text, row.hits, (key, str, style) => {

      if (wylieOn) {
        str = wylie.toWylie(str);
      }
      if (style) {

        // default
        style = {backgroundColor: '#f1c40f'};

        if ((row.uti === visibleUti) && (highlightIndex === matchIndex) && searchBarOn) {
          // target
          style.backgroundColor = '#e67e22';
        }
        highlightIndex++;
        return <TibetanText style={style} key={key}>{str}</TibetanText>;
      }
      return <TibetanText key={key}>{str}</TibetanText>;
    });

    return <TibetanText style={defaultStyle} children={children} />;
  };

  handleRowLayout(row, event) {
    this._rowsLayout[row.uti] = event.nativeEvent.layout;
  }

  renderRow = row => {
    return (
      <View onLayout={this.handleRowLayout.bind(this, row)} style={{paddingLeft: 14, paddingRight: 14, marginBottom: 20}}>
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

  getVisibleUti = () => {

    let {utis} = this.props;
    let middle = this.lastOffsetY + (Dimensions.get('window').height / 2);

    let layoutRow = _.chain(utis)
      .map(uti => {
        const layout = this._rowsLayout[uti];
        return layout ? {uti, layout} : null;
      })
      .filter(_.isObject)
      .filter(row => {
        let {layout} = row;
        return (layout.y < middle) && (middle < (layout.y + layout.height));
      })
      .first()
      .value();

    return layoutRow ? layoutRow.uti : _.first(utis);
  };

  updateTitle = _.debounce(async () => {
    let uti = this.getVisibleUti();
    let data = await toc({uti});
    this.setTitle(_.get(data, 'breadcrumb[3].t'));
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

  showBiography = () => {
    let uti = this.getVisibleUti();
    if (uti) {
      this.props.navigator.push({
        name: 'Biography',
        title: this.state.title,
        uti
      });
    }
  };

  onInputChange = searchKeyword => this.props.setSearchKeyword(searchKeyword);

  handleSubmit = () => this.setToolbarStatus(false);

  goTop = async () => {

    let {setLoading, searchKeyword} = this.props;

    setLoading(true);

    let rows;

    try {
      let uti = this.getVisibleUti();
      let data = await toc({uti});
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

  renderBackgroundImage = () => {
    switch (this.props.backgroundIndex) {
      case 0:
        return <View style={{backgroundColor: '#ffffff', position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}} />;
      case 1:
        return <Image style={globalStyles.cover} resizeMode="cover" source={require('image!bg-scripture')} />;
      case 2:
        return <Image style={globalStyles.cover} resizeMode="cover" source={require('image!bg-scripture2')} />;
    }
  };

  closeSearchInput = () => {
    this._lastSearchKeyword = this.props.searchKeyword;
    this.props.setSearchKeyword('');
    this.props.setSearchBarStatus(false);
  };

  goPreviousKeyword = () => {

    let {matchIndex, setMatchIndex} = this.props;

    if (0 === matchIndex) {
      console.log('prev limit');
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
      console.log('next limit');
      return;
    }

    if (matchIndex < lastIndex) {
      setMatchIndex(matchIndex + 1);
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
        <TouchableHighlight onPress={this.showBiography} style={styles.bottomButton} underlayColor={underlayColor}>
          <Icon name="ion|document-text" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
        </TouchableHighlight>
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
      return renderSpinner();
    }
  };

  render() {

    let {toolbarOn, isLoading} = this.props;

    if (isLoading) {
      return renderSpinner();
    }

    let listViewProps = {
      dataSource: this.state.dataSource,
      onEndReached: this.onEndReached,
      pageSize: 1,
      ref: LIST_VIEW,
      renderRow: this.renderRow,
      renderAheadDistance: 2000,
      onEndReachedThreshold: 3000,
      onChangeVisibleRows: this.handleChangeVisibleRows,
      renderFooter: this.renderFooter,
      renderScrollComponent: props => {

        let onScroll = props.onScroll;

        props.onScroll = (...args) => {
          onScroll.apply(null, args);
          this.handleScroll(...args);
        };
        props.onTouchStart = this.handleTouchStart;
        props.onTouchEnd = this.handleTouchEnd;
        props.ref = scrollView => this._scrollView = scrollView;

        return <ScrollView {...props} />;
      },
      loadData: this.loadPrev
    };

    return (
      <View style={[globalStyles.transparentContainer, {paddingTop: 0}]}>
        <View style={globalStyles.backgroundImageContainer}>
          {this.renderBackgroundImage()}
        </View>

        <View style={[globalStyles.transparentContainer, {paddingTop: 20}]}>

          <View style={styles.container}>
            <RefreshableListView {...listViewProps} />
            <View style={[styles.nav, {top: toolbarOn ? 0 : -60}]}>
              <TouchableHighlight onPress={this.goBack} style={styles.navButton} underlayColor={underlayColor}>
                <Icon name="ion|chevron-left" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
              </TouchableHighlight>
              <TibetanText numberOfLines={1} style={styles.navTitle}>{this.state.title}</TibetanText>
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
  }
}

export default DetailView;
