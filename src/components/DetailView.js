import React, {ListView, Text, Component, View, PropTypes, TextInput,
  TouchableHighlight, TouchableOpacity, Image, ScrollView, LayoutAnimation} from 'react-native';
import RefreshableListView from 'react-native-refreshable-listview';
import _ from 'lodash';
import shouldPureComponentUpdate from 'react-pure-render/function';
import wylie from 'tibetan/wylie';
import {DB_NAME} from '../constants/AppConstants';
import {Icon} from 'react-native-icons';
import {connect} from 'react-redux/native';
import {loadNext, loadPrev, renderSpinner, fetch} from '../helpers';
import {setFirstScroll, setToolbarStatus} from '../modules/detailView';
import {setSideMenuStatus} from '../modules/main';
import {styles} from './DetailView.style';
import {toc, getUti, highlight} from '../helpers';
import {values, styles as globalStyles} from '../styles/global.style';

const underlayColor = 'rgba(0, 0, 0, 0)';
const fontColor = '#ffffff';

const TOP = -20;
const DEFAULT_TOP_REACHED_THRESHOLD = 1000;
const ZERO_WIDTH_SPACE = String.fromCharCode(parseInt('200B', 16));

const LIST_VIEW = 'listView';

@connect(state => ({
  firstScroll: state.detailView.get('firstScroll'),
  fontSize: state.main.get('fontSize'),
  lineHeight: state.main.get('lineHeight'),
  toolbarOn: state.detailView.get('toolbarOn'),
  wylieOn: state.main.get('wylieOn')
}), {setFirstScroll, setToolbarStatus, setSideMenuStatus})
class DetailView extends Component {

  static PropTypes = {
    fetchTitle: PropTypes.bool,
    firstScroll: PropTypes.bool.isRequired,
    fontSize: PropTypes.number.isRequired,
    lineHeight: PropTypes.number.isRequired,
    navigator: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    rows: PropTypes.array.isRequired,
    setFirstScroll: PropTypes.func.isRequired,
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

  componentDidMount() {
    this.isLoading = false;
    this.isLoadingTitle = false;
    this.lastOffsetY = 0;
    this.isScrolling = false;
    this.direction = null;
    this.setTitle(this.props.title);
    this.preload();
  }

  preload = async () => {

    let promises = [];

    this.setLoading(true);
    this._rows = this.props.rows;
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
      let rows = await loadPrev({count: 1, uti});
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
  };

  getVisibleUti = () => {

    let listView = _.get(this.refs[LIST_VIEW], 'refs.listview.refs.listview');
    let utis = Object.keys(listView._visibleRows.s1)
      .map(index => this._rows[index])
      .filter(row => undefined !== row)
      .map(row => getUti(row));

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

  handleSubmit = async () => {

    let {uti} = this.props;
    let index = _.findIndex(this._rows, row => (row.uti === uti) || (row.segname === uti));

    if (-1 !== index) {
      this._rows.splice(0, index);
      this.rerenderListView();
      return Promise.resolve();
    }

    this.setLoading(true);

    try {
      let rows = await fetch({uti}) || [];
      rows = rows.filter(row => undefined !== row.vpos);

      if (rows.length > 0) {
        this._rows = rows;
        await this.loadNext();
      }
    }
    catch (err) {
      // uti not found
      console.log('loadNext err:', err);
    }
    this.setLoading(false);
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

    return (
      <View style={[globalStyles.transparentContainer, {paddingTop: 0}]}>
        <View style={globalStyles.backgroundImageContainer}>
          <Image style={globalStyles.cover} resizeMode="cover" source={require('image!bg-scripture')} />
        </View>
        <View style={[globalStyles.transparentContainer, {paddingTop: 20}]}>
          <View style={styles.container}>
            <RefreshableListView {...listViewProps} />
            <View style={[styles.nav, {top: toolbarOn ? 0 : -60}]}>
              <TouchableHighlight onPress={this.goBack} style={styles.navButton} underlayColor={underlayColor}>
                <Icon name="ion|chevron-left" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
              </TouchableHighlight>
              <Text numberOfLines={1} style={styles.navTitle}>{this.state.title}</Text>
              <TouchableHighlight onPress={this.goHome} style={styles.navButton} underlayColor={underlayColor}>
                <Icon name="ion|home" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
              </TouchableHighlight>
              <TouchableHighlight onPress={this.openSideMenu} style={styles.navButton} underlayColor={underlayColor}>
                <Icon name="fontawesome|gear" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default DetailView;
