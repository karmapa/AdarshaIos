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
import {setToolbarStatus, setUti, setFontSize, setLineHeight, setWylieStatus} from '../modules/detailView';
import {styles} from './detailView.style';
import {toc, getUti, highlight} from '../helpers';
import {values, styles as globalStyles} from '../styles/global.style';

const underlayColor = 'rgba(0, 0, 0, 0)';
const fontColor = '#ffffff';

const TOP = -20;
const DEFAULT_TOP_REACHED_THRESHOLD = 1000;

const LIST_VIEW = 'listView';

@connect(state => ({
  fontSize: state.detailView.get('fontSize'),
  lineHeight: state.detailView.get('lineHeight'),
  toolbarOn: state.detailView.get('toolbarOn'),
  wylieOn: state.detailView.get('wylieOn')
}), {setFontSize, setLineHeight, setWylieStatus, setToolbarStatus})
class DetailView extends Component {

  static PropTypes = {
    fetchTitle: PropTypes.bool,
    fontSize: PropTypes.number.isRequired,
    lineHeight: PropTypes.number.isRequired,
    navigator: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    rows: PropTypes.array.isRequired,
    setFontSize: PropTypes.func.isRequired,
    setLineHeight: PropTypes.func.isRequired,
    setWylieStatus: PropTypes.func.isRequired,
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

  decreaseFontSize = () => {
    let fontSize = this.props.fontSize - 1;
    if (fontSize >= 0) {
      this.props.setFontSize(fontSize);
    }
    this.rerenderListView();
  };

  increaseFontSize = () => {
    let fontSize = this.props.fontSize + 1;
    if (fontSize < 30) {
      this.props.setFontSize(fontSize);
    }
    this.rerenderListView();
  };

  decreaseLineHeight = () => {
    let lineHeight = this.props.lineHeight - 0.1;
    if (lineHeight >= 0) {
      this.props.setLineHeight(lineHeight);
    }
    this.rerenderListView();
  };

  increaseLineHeight = () => {
    let lineHeight = this.props.lineHeight + 0.1;
    if (lineHeight < 30) {
      this.props.setLineHeight(lineHeight);
    }
    this.rerenderListView();
  };

  toggleWylieStatus = () => {
    let status = this.props.wylieOn;
    this.props.setWylieStatus(! status);
    this.rerenderListView();
  };

  renderText = row => {

    let {fontSize, lineHeight, wylieOn} = this.props;

    if (wylieOn) {
      return <Text style={{fontSize, lineHeight: lineHeight * fontSize}}>{wylie.toWylie(row.text)}</Text>;
    }
    else {
      let children = highlight(row.text, row.realHits);
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

  updateTitle = _.debounce(async direction => {

    let listView = _.get(this.refs[LIST_VIEW], 'refs.listview.refs.listview');
    let utis = Object.keys(listView._visibleRows.s1)
      .map(index => this._rows[index])
      .filter(row => undefined !== row)
      .map(row => getUti(row));

    let uti = 'up' === direction ? _.first(utis) : _.last(utis);
    let data = await toc({uti});
    this.setTitle(_.get(data, 'breadcrumb[3].t'));
  }, 100);

  handleScroll = event => {
    this.isScrolling = true;
    if (this.props.toolbarOn) {
      this.setToolbarStatus(false);
    }
    let offsetY = _.get(event, 'nativeEvent.contentOffset.y');
    let direction = offsetY > this.lastOffsetY ? 'down' : 'up';

    this.updateTitle(direction);
    this.lastOffsetY = offsetY;
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

  handleInputChange = text => {
    this.props.setUti(text);
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
        </View>
        <View style={[styles.boxButton, {bottom: toolbarOn ? 0 : -50}]}>
          <TouchableHighlight underlayColor={underlayColor} style={[styles.button]} onPress={this.decreaseLineHeight}>
            <Image style={styles.buttonImage} source={require('image!icon-line-height-minus')} />
          </TouchableHighlight>
          <TouchableHighlight underlayColor={underlayColor} style={[styles.button]} onPress={this.increaseLineHeight}>
            <Image style={styles.buttonImage} source={require('image!icon-line-height-add')} />
          </TouchableHighlight>
          <TouchableHighlight underlayColor={underlayColor} style={[styles.button]} onPress={this.decreaseFontSize}>
            <Image style={styles.buttonImage} source={require('image!icon-font-size-minus')} />
          </TouchableHighlight>
          <TouchableHighlight underlayColor={underlayColor} style={[styles.button]} onPress={this.increaseFontSize}>
            <Image style={styles.buttonImage} source={require('image!icon-font-size-add')} />
          </TouchableHighlight>
          <TouchableHighlight underlayColor={underlayColor} style={[styles.button]} onPress={this.toggleWylieStatus}>
            <Image style={styles.buttonImage} source={require('image!icon-tibetan-wylie-switch')} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default DetailView;
