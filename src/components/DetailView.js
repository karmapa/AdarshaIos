import React, {Component, View, PropTypes, Dimensions,
  TouchableHighlight, ScrollView, LayoutAnimation, Image} from 'react-native';
import RefreshableListView from 'react-native-refreshable-listview';
import _ from 'lodash';
import shouldPureComponentUpdate from 'react-pure-render/function';
import wylie from 'tibetan/wylie';
import {Icon} from 'react-native-icons';
import {connect} from 'react-redux/native';
import {loadNext, loadPrev, renderSpinner, fetch, cleanKeyword} from '../helpers';
import {setHasScrolled, setToolbarStatus, setLoading,
  setTitle, setMatchIndex, setUtis, setLoadingMore, setVisibleUti,
  setDataSource} from '../modules/detailView';
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

const LIST_VIEW = 'listView';

@connect(state => ({
  dataSource: state.detailView.get('dataSource'),
  fontSize: state.main.get('fontSize'),
  hasScrolled: state.detailView.get('hasScrolled'),
  isLoading: state.detailView.get('isLoading'),
  isLoadingMore: state.detailView.get('isLoadingMore'),
  lineHeight: state.main.get('lineHeight'),
  matchIndex: state.detailView.get('matchIndex'),
  title: state.detailView.get('title'),
  toolbarOn: state.detailView.get('toolbarOn'),
  utis: state.detailView.get('utis'),
  visibleUti: state.detailView.get('visibleUti'),
  wylieOn: state.main.get('wylieOn')
}), {setHasScrolled, setToolbarStatus, setSideMenuStatus, setVisibleUti,
  setMatchIndex, setUtis, setLoadingMore, setLoading, setTitle, setDataSource})
class DetailView extends Component {

  static PropTypes = {
    dataSource: PropTypes.object.isRequired,
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
    setDataSource: PropTypes.func.isRequired,
    setHasScrolled: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setLoadingMore: PropTypes.func.isRequired,
    setMatchIndex: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    setUtis: PropTypes.func.isRequired,
    setVisibleUti: PropTypes.func.isRequired,
    title: PropTypes.string,
    toolbarOn: PropTypes.bool.isRequired,
    utis: PropTypes.array.isRequired,
    visibleUti: PropTypes.string.isRequired,
    wylieOn: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this._layoutData = {};

    this.lastOffsetY = 0;
    this.isScrolling = false;
  }

  componentDidMount() {

    LayoutAnimation.spring();

    this.initDataSource();
    this.preloadDetailView();
  }

  preloadDetailView = () => {
    this.props.setLoading(true);
    TimerMixin.setTimeout(() => {
      this.preload({append: true})
        .catch(err => console.log('preload err: ', err));
    }, 500);
  };

  initDataSource = () => {
    let {dataSource, setDataSource} = this.props;
    dataSource._rowHasChanged = this._rowHasChanged;
    setDataSource(dataSource);
  };

  _rowHasChanged = (row1, row2) => {
    if (this.isVisibleRow(row2)) {
      return true;
    }
    return row1 !== row2;
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  componentWillReceiveProps(nextProps, nextState) {

    if (! _.isEqual(_.pick(this.props, SETTINGS_PROPS), _.pick(nextProps, SETTINGS_PROPS))) {
      this.rerenderListView();
    }
    else if (this.props.matchIndex !== nextProps.matchIndex) {
      this.rerenderListView();
    }
  }

  scrollTo = offsetY => {

    let scrollComponent = this.refs[LIST_VIEW].getScrollResponder();

    if (scrollComponent) {
      scrollComponent.scrollTo(offsetY);
    }
  };

  isVisibleRow = row => {
    return this.props.utis.includes(row.uti);
  };

  getVisibleRow = () => {
    let uti = this.props.visibleUti || _.get(_.first(this._rows), 'uti');
    return _.find(this._rows, {uti});
  };

  preload = async (options = {}) => {

    options = Object.assign({
      rows: this.props.rows,
      append: false
    }, options);

    let {rows, append} = options;
    let {setLoading, isLoading, setVisibleUti} = this.props;

    if (! isLoading) {
      setLoading(true);
    }
    this._rows = rows || [];

    let newRows = await this.fetchNextRows();
    let dataSource = this.getDataSource(newRows, append);

    let assignedUti = _.get(_.first(this._rows), 'uti');
    if (assignedUti) {
      setVisibleUti(assignedUti);
    }
    this.props.setDataSource(dataSource);
    await this.fetchTitle();

    setLoading(false);
  };

  fetchTitle = async () => {

    let vposEnd = _.get(_.first(this.props.rows), 'vpos_end');

    if (vposEnd) {
      let data = await toc({vpos: vposEnd});
      let title = _.get(data, 'breadcrumb[3].t');
      this.props.setTitle(title);
    }
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
    return this.props.dataSource.cloneWithRows(this._rows);
  };

  rerenderListView = () => {
    this.props.setDataSource(this.props.dataSource.cloneWithRows(this._rows));
  };

  goBack = () => {
    this.props.navigator.pop();
  };

  goHome = () => {
    this.props.navigator.popToTop();
  };

  renderText = row => {

    const {fontSize, lineHeight, wylieOn, matchIndex, visibleUti} = this.props;
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

        if ((row.uti === visibleUti) && (highlightIndex === matchIndex)) {
          // target
          // style.backgroundColor = COLOR_ORANGE;
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
      return;
    }

    try {
      let rows = await loadPrev({count: 1, uti, q: cleanKeyword(this.props.keyword)});
      this.props.setDataSource(this.getDataSource(rows, false));
    }
    catch (e) {
      // uti not found
      console.log('loadPrev err', e);
    }
  };

  fetchNextRows = () => {

    let lastRow = _.last(this._rows);
    let uti = getUti(lastRow);

    if (! uti) {
      return;
    }
    return loadNext({count: 5, uti, q: cleanKeyword(this.props.keyword)});
  };

  loadNext = async () => {

    let {isLoadingMore, setLoadingMore, setDataSource} = this.props;

    if (isLoadingMore) {
      return;
    }

    setLoadingMore(true);

    let rows = await this.fetchNextRows();

    setDataSource(this.getDataSource(rows));
    setLoadingMore(false);
  };

  setToolbarStatus = toolbarOn => {
    LayoutAnimation.spring();
    this.props.setToolbarStatus(toolbarOn);
  };

  getAllUtis = () => {
    return _.pluck(this._rows, 'uti');
  };

  getOffsetMiddle = () => this.lastOffsetY + (Dimensions.get('window').height / 2);

  getOffsetBottom = () => this.lastOffsetY + Dimensions.get('window').height;

  getWindowHeight = () => Dimensions.get('window').height;

  setVisibleUti = assignedUti => {

    let {utis, setVisibleUti} = this.props;

    if (assignedUti) {
      setVisibleUti(assignedUti);
    }
    let offsetMiddle = this.getOffsetMiddle();

    let layoutRow = _.chain(utis)
      .map(uti => {
        const layout = this._layoutData[uti];
        return layout ? {uti, layout} : null;
      })
      .filter(_.isObject)
      .filter(row => {
        let {layout} = row;
        return (layout.y < offsetMiddle) && (offsetMiddle < (layout.y + layout.height));
      })
      .first()
      .value();

    let visibleUti = layoutRow ? layoutRow.uti : _.get(this._rows, '[0].uti');

    setVisibleUti(visibleUti);
  };

  updateTitle = _.debounce(async () => {

    let vposEnd = _.get(this.getVisibleRow(), 'vpos_end');

    if (vposEnd) {
      let data = await toc({vpos: vposEnd});
      let title = _.get(data, 'breadcrumb[3].t');
      this.props.setTitle(title);
    }
  }, 100);

  handleScroll = event => {
    this.isScrolling = true;

    if (this.props.toolbarOn && this.props.hasScrolled) {
      this.setToolbarStatus(false);
    }

    let offsetY = _.get(event, 'nativeEvent.contentOffset.y');

    this.updateTitle();
    this.lastOffsetY = offsetY;
    this.props.setHasScrolled(true);
    this.setVisibleUti();
  };

  handlePress = () => {
    this.setToolbarStatus(! this.props.toolbarOn);
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
    let visibleRow = this.getVisibleRow();

    if (visibleRow) {
      this.props.navigator.push({
        name: 'Biography',
        title: this.props.title,
        vpos: _.get(visibleRow, 'vpos_end')
      });
    }
  };

  handleSubmit = () => this.setToolbarStatus(false);

  goTop = async () => {

    let {isLoading, setLoading, keyword} = this.props;

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
        q: cleanKeyword(keyword)
      });

    } catch(err) {
      console.log('goTop err:', err);
      setLoading(false);
      return;    // don't do anything
    }

    if (rows && (rows.length > 0)) {
      TimerMixin.setTimeout(() => {
        this.preload({rows, append: false})
          .then(() => {
            this.props.setMatchIndex(0);
          });
      }, 0);
    }
  };

  getUtisWithHits = utis => {
    return utis.filter(uti => {
      let row = _.find(this._rows, {uti}) || {};
      return (row.hits || []).length > 0;
    });
  };

  getPreviousUti = () => {

    let {visibleUti, utis} = this.props;
    let utisWithHits = this.getUtisWithHits(utis);

    let index = utisWithHits.indexOf(visibleUti);
    let notFound = -1 === index;
    let noNext = 0 === index;

    if (notFound || noNext) {
      return [];
    }
    return utisWithHits[index - 1];
  };

  getNextUti = () => {

    let {visibleUti, utis} = this.props;
    let utisWithHits = this.getUtisWithHits(utis);

    let index = utisWithHits.indexOf(visibleUti);
    let notFound = -1 === index;
    let noNext = index === (utisWithHits.length - 1);

    if (notFound || noNext) {
      return null;
    }
    return utisWithHits[index + 1];
  };

  getOffsetYByMatchIndex = (matchIndex = this.props.matchIndex, visibleUti = this.props.visibleUti) => {

    let row = _.find(this._rows, {uti: visibleUti});
    let layoutRow = this._layoutData[visibleUti];

    if (_.isEmpty(row) || _.isEmpty(layoutRow)) {
      return null;
    }

    let hits = row.hits || [];
    let hit = hits[matchIndex];

    if (_.isUndefined(hit)) {
      return null;
    }
    let [start] = hit;

    return parseInt((layoutRow.height * (start / row.text.length)) + layoutRow.y, 10);
  };

  renderBottomBarContent = () => {

    return (
      <View style={styles.rows}>
        <TouchableHighlight onPress={this.goHome} style={styles.bottomButton} underlayColor={underlayColor}>
          <Icon name="ion|home" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
        </TouchableHighlight>
        <TouchableHighlight onPress={this.showBiography} style={styles.bottomButton} underlayColor={underlayColor}>
          <Image style={{width: 16, height: 16}} source={require('image!icon-biography')} />
        </TouchableHighlight>
        <TouchableHighlight onPress={this.openSideMenu} style={styles.bottomButton} underlayColor={underlayColor}>
          <Icon name="fontawesome|gear" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
        </TouchableHighlight>
      </View>
    );
  };

  getUpButtonBottom = () => {
    return 50;
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
      dataSource: this.props.dataSource,
      onEndReached: this.onEndReached,
      pageSize: 1,
      ref: LIST_VIEW,
      renderRow: this.renderRow,
      renderAheadDistance: 2000,
      onEndReachedThreshold: 300,
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
        <View style={[globalStyles.transparentContainer]}>

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
