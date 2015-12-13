import React, {ListView, Text, Component, View, PropTypes, TouchableHighlight, Image, ScrollView} from 'react-native';
import _ from 'lodash';
import shouldPureComponentUpdate from 'react-pure-render/function';
import wylie from 'tibetan/wylie';
import {DB_NAME} from '../constants/AppConstants';
import {Icon} from 'react-native-icons';
import {connect} from 'react-redux/native';
import {loadNext, loadPrev, renderSpinner} from '../helpers';
import {styles} from './detailView.style';
import {values, styles as globalStyles} from '../styles/global.style';
import {setFontSize, setLineHeight, setWylieStatus} from '../modules/main';

const RCTUIManager = require('NativeModules').UIManager;

const TOP = -20;
const DEFAULT_TOP_REACHED_THRESHOLD = 1000;

@connect(state => ({
  fontSize: state.main.get('fontSize'),
  lineHeight: state.main.get('lineHeight'),
  toWylie: state.main.get('toWylie')
}), {setFontSize, setLineHeight, setWylieStatus})
class DetailView extends Component {

  static PropTypes = {
    navigator: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    rows: PropTypes.array.isRequired,
    setFontSize: PropTypes.func.isRequired,
    setLineHeight: PropTypes.func.isRequired,
    setWylieStatus: PropTypes.func.isRequired,
    fontSize: PropTypes.number.isRequired,
    lineHeight: PropTypes.number.isRequired,
    toWylie: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    }),
    loading: false
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  componentDidMount() {

    this.loading = false;

    // preload
    let {rows} = this.props;
    let lastRow = _.last(rows);
    let uti = lastRow.uti || lastRow.segname;

    this.setLoading(true);

    this._rows = rows;
    this.loadNext()
      .finally(() => {
        this.setLoading(false);
      });
  }

  setLoading = loading => {
    this.setState({loading});
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
    let status = this.props.toWylie;
    this.props.setWylieStatus(! status);
    this.rerenderListView();
  };

  renderRow = (row, index) => {
    let {fontSize, lineHeight, toWylie} = this.props;
    return (
      <View style={{paddingLeft: 14, paddingRight: 14, marginBottom: 20}}>
        <View style={{borderColor: '#cccccc', borderBottomWidth: 1, paddingBottom: 14}}>
          <Text>{row.uti || row.segname}</Text>
          <Text style={{fontSize, lineHeight: lineHeight * fontSize}}>{toWylie ? wylie.toWylie(row.text) : row.text}</Text>
        </View>
      </View>
    );
  };

  onTopReached = () => {
    this.loadPrev();
  };

  onEndReached = () => {
    this.loadNext();
  }

  getListViewContentLength = () => {
    return this.refs.listView.scrollProperties.contentLength;
  };

  getListViewOffset = () => {
    return this.refs.listView.scrollProperties.offset;
  };

  loadPrev = () => {

    if (this.loading) {
      return Promise.reject('loading');
    }
    this.loading = true;

    let firstRow = _.first(this._rows);
    let uti = firstRow.uti || firstRow.segname;

    if (! uti) {
      return Promise.reject('uti is missing');
    }

    return loadPrev({count: 5, uti})
      .then(rows => {
        this.loadedPrev = true;
        this.lastContentLength = this.getListViewContentLength();
        this.setState({
          dataSource: this.getDataSource(rows, false)
        });
      })
      .finally(() => {
        this.loading = false;
      });
  };

  loadNext = () => {

    if (this.loading) {
      return Promise.reject('loading');
    }
    this.loading = true;

    let lastRow = _.last(this._rows);
    let uti = lastRow.uti || lastRow.segname;

    if (! uti) {
      return Promise.reject('uti is missing');
    }

    return loadNext({count: 100, uti})
      .then(rows => {
        this.setState({
          dataSource: this.getDataSource(rows)
        });
      })
      .finally(() => {
        this.loading = false;
      });
  };

  handleScroll = () => {
    let listView = this.refs.listView;
    let scrollProps = listView.scrollProperties;
    let {totalRows} = listView.getMetrics();
    let {offset} = scrollProps;

    if (-20 === offset) {
      this.onTopReached();
    }
  };

  handleChangeVisibleRows = () => {
    if (! this.overriddenScrollContentLength) {
      let listView = this.refs.listView;
      let setScrollContentLength = listView._setScrollContentLength;
      this.refs.listView._setScrollContentLength = (...args) => {
        setScrollContentLength.apply(listView, args);
        this.handleScrollContentLengthChange();
      };
      this.overriddenScrollContentLength = true;
    }
  };

  handleScrollContentLengthChange = () => {
    if (this.loadedPrev) {
      let contentLength = this.getListViewContentLength();
      let delta = contentLength - this.lastContentLength;
      let responder = this.refs.listView.getScrollResponder();
      let offset = this.getListViewOffset();
      responder.scrollWithoutAnimationTo(offset + delta);
      this.loadedPrev = false;
    }
  };

  render() {

    if (this.state.loading) {
      return renderSpinner();
    }

    let listViewProps = {
      dataSource: this.state.dataSource,
      onEndReached: this.onEndReached,
      pageSize: 5,
      onScroll: this.handleScroll,
      ref: 'listView',
      renderRow: this.renderRow,
      scrollEventThrottle: 16,
      removeClippedSubviews: true,
      onChangeVisibleRows: this.handleChangeVisibleRows,
    };

    return (
      <View style={styles.container}>
        <View style={styles.nav}>
          <TouchableHighlight onPress={this.goBack} style={styles.navButton} underlayColor={values.underlayColor}>
            <Icon name="ion|chevron-left" style={globalStyles.navIcon} size={values.navIconSize} color={values.navIconColor} />
          </TouchableHighlight>
          <Text numberOfLines={1} style={styles.navTitle}>{this.props.title}</Text>
          <TouchableHighlight onPress={this.goHome} style={styles.navButton} underlayColor={values.underlayColor}>
            <Icon name="ion|home" style={globalStyles.navIcon} size={values.navIconSize} color={values.navIconColor} />
          </TouchableHighlight>
        </View>
        <ListView {...listViewProps} />
        <View style={styles.boxButton}>
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button]} onPress={this.decreaseLineHeight}>
            <Image style={styles.buttonImage} source={require('image!icon-line-height-minus')} />
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button]} onPress={this.increaseLineHeight}>
            <Image style={styles.buttonImage} source={require('image!icon-line-height-add')} />
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button]} onPress={this.decreaseFontSize}>
            <Image style={styles.buttonImage} source={require('image!icon-font-size-minus')} />
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button]} onPress={this.increaseFontSize}>
            <Image style={styles.buttonImage} source={require('image!icon-font-size-add')} />
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button]} onPress={this.toggleWylieStatus}>
            <Image style={styles.buttonImage} source={require('image!icon-tibetan-wylie-switch')} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default DetailView;
