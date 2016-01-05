import React, {ListView, Text, Component, View, PropTypes, TextInput,
  TouchableHighlight, TouchableOpacity, Image, ScrollView, LayoutAnimation} from 'react-native';
import RefreshableListView from 'react-native-refreshable-listview';
import _ from 'lodash';
import shouldPureComponentUpdate from 'react-pure-render/function';
import wylie from 'tibetan/wylie';
import {DB_NAME} from '../constants/AppConstants';
import {Icon} from 'react-native-icons';
import {connect} from 'react-redux/native';
import {loadNext, loadPrev, renderSpinner, fetch, cleanKeyword} from '../helpers';
import {setSearchKeyword, setFirstScroll, setToolbarStatus} from '../modules/detailView';
import {setSideMenuStatus} from '../modules/main';
import {styles} from './DetailView.style';
import {toc, getUti, highlight} from '../helpers';
import {values, styles as globalStyles} from '../styles/global.style';
import {KeyboardSpacer} from '.';

const underlayColor = 'rgba(0, 0, 0, 0)';
const fontColor = '#ffffff';

const TOP = -20;
const DEFAULT_TOP_REACHED_THRESHOLD = 1000;
const ZERO_WIDTH_SPACE = String.fromCharCode(parseInt('200B', 16));
const SETTINGS_PROPS = ['fontSize', 'lineHeight', 'wylieOn'];

const LIST_VIEW = 'listView';

@connect(state => ({
  backgroundIndex: state.main.get('backgroundIndex'),
  firstScroll: state.detailView.get('firstScroll'),
  fontSize: state.main.get('fontSize'),
  lineHeight: state.main.get('lineHeight'),
  searchKeyword: state.detailView.get('searchKeyword'),
  toolbarOn: state.detailView.get('toolbarOn'),
  wylieOn: state.main.get('wylieOn'),
  keyword: state.keyboardSearch.get('keyword')
}), {setFirstScroll, setToolbarStatus, setSideMenuStatus, setSearchKeyword})
class DetailView extends Component {

  static PropTypes = {
    backgroundIndex: PropTypes.number.isRequired,
    fetchTitle: PropTypes.bool,
    firstScroll: PropTypes.bool.isRequired,
    fontSize: PropTypes.number.isRequired,
    lineHeight: PropTypes.number.isRequired,
    navigator: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    rows: PropTypes.array.isRequired,
    keyword: PropTypes.string.isRequired,
    searchKeyword: PropTypes.string.isRequired,
    setFirstScroll: PropTypes.func.isRequired,
    setSearchKeyword: PropTypes.func.isRequired,
    title: PropTypes.string,
    toolbarOn: PropTypes.bool.isRequired,
    wylieOn: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
  }

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    }),
    isLoading: false,
    title: ''
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  componentWillMount() {
    LayoutAnimation.spring();
  }

  componentWillReceiveProps(nextProps) {
    if (! _.isEqual(_.pick(this.props, SETTINGS_PROPS), _.pick(nextProps, SETTINGS_PROPS))) {
      this.rerenderListView();
    }
    if (this.props.searchKeyword !== nextProps.searchKeyword) {
      this.highlightAsync(nextProps.searchKeyword);
    }
  }

  highlightAsync = async searchKeyword => {
    let utis = this.getAllUtis();
    this._rows = await fetch({uti: utis, q: cleanKeyword(searchKeyword)});
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
    this.preload();
  }

  preload = async (rows = this.props.rows) => {

    let promises = [];

    this.setLoading(true);
    this._rows = rows;
    promises.push(this.loadNext());

    if (this.props.fetchTitle) {
      promises.push(this.fetchTitle());
    }
    await* promises;
    this.setLoading(false);
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

  setLoading = isLoading => {
    this.setState({isLoading});
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
    // workaround of forcing a ListView to update
    // https://github.com/facebook/react-native/issues/1133
    this._rows = JSON.parse(JSON.stringify(this._rows));
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._rows)
    });
  };

  goBack = () => {
    this.props.navigator.pop();
  };

  goHome = () => {
    this.props.navigator.popToTop();
  };

  renderText = row => {

    let {fontSize, lineHeight, wylieOn} = this.props;
    let text = row.text.replace(/\n/g, ZERO_WIDTH_SPACE);

    if (wylieOn) {
      return <Text style={{fontSize, lineHeight: lineHeight * fontSize}}>{wylie.toWylie(text)}</Text>;
    }
    else {
      let children = highlight(text, row.hits);
      return <Text style={{fontSize, lineHeight: lineHeight * fontSize}} children={children} />;
    }
  };

  renderRow = row => {
    return (
      <View style={{paddingLeft: 14, paddingRight: 14, marginBottom: 20}}>
        <View style={{borderColor: '#000000', borderBottomWidth: 1, paddingBottom: 14}}>
          <Text>{getUti(row)}</Text>
          {this.renderText(row)}
        </View>
      </View>
    );
  };

  onEndReached = () => {
    this.loadNext();
  }

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

    if (this.isLoading) {
      return Promise.reject('isLoading');
    }
    this.isLoading = true;

    let lastRow = _.last(this._rows);
    let uti = getUti(lastRow);

    if (! uti) {
      return Promise.reject('uti is missing');
    }

    let rows = await loadNext({count: 100, uti});

    this.setState({
      dataSource: this.getDataSource(rows)
    });
    this.isLoading = false;
  };

  setToolbarStatus = toolbarOn => {
    LayoutAnimation.spring();
    this.props.setToolbarStatus(toolbarOn);

    if (false === toolbarOn) {
      this.refs.searchInput.blur();
    }
  };

  getAllUtis = () => {
    return _.pluck(this._rows, 'uti');
  };

  getVisibleUtis = () => {

    let listView = _.get(this.refs[LIST_VIEW], 'refs.listview.refs.listview');

    return Object.keys(listView._visibleRows.s1)
      .map(index => this._rows[index])
      .filter(row => undefined !== row)
      .map(row => getUti(row));
  };

  getVisibleUti = () => {
    let utis = this.getVisibleUtis();
    return 'up' === this.direction ? _.first(utis) : _.last(utis);
  };

  updateTitle = _.debounce(async () => {
    let uti = this.getVisibleUti();
    let data = await toc({uti});
    this.setTitle(_.get(data, 'breadcrumb[3].t'));
  }, 100);

  handleScroll = event => {
    this.isScrolling = true;
    if (this.props.toolbarOn && this.props.firstScroll) {
      this.setToolbarStatus(false);
    }
    let offsetY = _.get(event, 'nativeEvent.contentOffset.y');
    this.direction = offsetY > this.lastOffsetY ? 'down' : 'up';

    this.updateTitle();
    this.lastOffsetY = offsetY;
    this.props.setFirstScroll(true);
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

    this.setLoading(true);

    let rows;

    try {
      let uti = this.getVisibleUti();
      let data = await toc({uti});
      let vpos = _.get(data, 'breadcrumb[3].vpos');

      rows = await fetch({
        vpos,
        q: cleanKeyword(this.props.searchKeyword)
      });

    } catch(err) {
      console.log('goTop err:', err);
      this.setLoading(false);
      return;    // don't do anything
    }

    if (rows && (rows.length > 0)) {
      this.preload(rows);
    }
  };

  renderBackgroundImage = () => {
    switch (this.props.backgroundIndex) {
      case 0:
        return <View style={{backgroundColor: '#ffffff', position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}></View>;
      case 1:
        return <Image style={globalStyles.cover} resizeMode="cover" source={require('image!bg-scripture')} />
      case 2:
        return <Image style={globalStyles.cover} resizeMode="cover" source={require('image!bg-scripture2')} />
    }
  };

  render() {

    if (this.state.isLoading) {
      return renderSpinner();
    }

    let {uti, toolbarOn} = this.props;

    let listViewProps = {
      dataSource: this.state.dataSource,
      onEndReached: this.onEndReached,
      pageSize: 1,
      ref: LIST_VIEW,
      renderRow: this.renderRow,
      renderScrollComponent: props => {

        let onScroll = props.onScroll;

        props.onScroll = (...args) => {
          onScroll.apply(null, args);
          this.handleScroll(...args);
        };
        props.onTouchStart = this.handleTouchStart;
        props.onTouchEnd = this.handleTouchEnd;

        return <ScrollView {...props} />
      },
      loadData: this.loadPrev
    };

    let inputProps = {
      ref: 'searchInput',
      autoCapitalize: 'none',
      autoCorrect: false,
      onChangeText: this.onInputChange,
      onSubmitEditing: this.handleSubmit,
      placeholder: 'Search in sutra',
      placeholderTextColor: 'rgba(0, 0, 0, 0.6)',
      style: styles.input,
      value: this.props.searchKeyword
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
              <TouchableHighlight style={styles.titleButton} onPress={this.showBiography} underlayColor={underlayColor}>
                <Text numberOfLines={1} style={styles.navTitle}>{this.state.title}</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={this.goHome} style={styles.navButton} underlayColor={underlayColor}>
                <Icon name="ion|home" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
              </TouchableHighlight>
              <TouchableHighlight onPress={this.openSideMenu} style={styles.navButton} underlayColor={underlayColor}>
                <Icon name="fontawesome|gear" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
              </TouchableHighlight>
            </View>
          </View>

          <View style={[styles.boxInput, {bottom: toolbarOn ? 0 : -70}]}>
            <TextInput {...inputProps} />
          </View>

          <TouchableHighlight onPress={this.goTop} style={[styles.upButton, {bottom: toolbarOn ? 77 : -147}]} underlayColor={underlayColor}>
            <Icon name="fontawesome|arrow-up" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
          </TouchableHighlight>
        </View>

        <KeyboardSpacer />

      </View>
    );
  }
}

export default DetailView;
