import React, {ListView, Text, Component, ScrollView, View, PropTypes, TouchableHighlight, Image} from 'react-native';
import _ from 'lodash';
import shouldPureComponentUpdate from 'react-pure-render/function';
import wylie from 'tibetan/wylie';
import {DB_NAME} from '../constants/AppConstants';
import {Icon} from 'react-native-icons';
import {styles} from './detailView.style';
import {values, styles as globalStyles} from '../styles/global.style';

let ksa = require('ksana-simple-api');

class DetailView extends Component {

  static PropTypes = {
    navigator: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    rows: PropTypes.array.isRequired,
    setFontSize: PropTypes.func.isRequired,
    setLineHeight: PropTypes.func.isRequired,
    setWylieStatus: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  componentDidMount() {
    this._rows = [];
    this._loading = false;
    this.offsetY = null;
    this.setState({
      dataSource: this.getDataSource([this.props.row])
    });
  }

  getDataSource = (rows) => {
    this._rows = this._rows.concat(rows);
    return this.state.dataSource.cloneWithRows(this._rows);
  }

  goBack = () => {
    this.props.navigator.pop();
  }

  goHome = () => {
    this.props.navigator.popToTop();
  }

  decreaseFontSize = () => {
    let fontSize = this.props.settings.fontSize - 1;
    if (fontSize >= 0) {
      this.props.setFontSize(fontSize);
    }
  }

  increaseFontSize = () => {
    let fontSize = this.props.settings.fontSize + 1;
    if (fontSize < 30) {
      this.props.setFontSize(fontSize);
    }
  }

  decreaseLineHeight = () => {
    let lineHeight = this.props.settings.lineHeight - 0.1;
    if (lineHeight >= 0) {
      this.props.setLineHeight(lineHeight);
    }
  }

  increaseLineHeight = () => {
    let lineHeight = this.props.settings.lineHeight + 0.1;
    if (lineHeight < 30) {
      this.props.setLineHeight(lineHeight);
    }
  }

  toggleWylieStatus = () => {
    let status = this.props.settings.toWylie;
    this.props.setWylieStatus(! status);
  }

  renderRow = (row, index) => {
    let {fontSize, lineHeight, toWylie} = this.props.settings;
    return <Text style={{fontSize, lineHeight: lineHeight * fontSize, paddingLeft: 14, paddingRight: 14}}>{toWylie ? wylie.toWylie(row.text) : row.text}</Text>
  }

  onEndReached = (event) => {
    console.info('onEndReached');
  }

  loadPrev = () => {

    /*if (this._loading) {
      return;
    }
    this._loading = true;
    let firstRow = _.first(this._rows);
    console.log('here', firstRow);
    ksa.prev({db: DB_NAME, count: 10, uti: 5}, (err, data) => {
      console.log('data', data);
      this._loading = false;
    });*/
  }

  handleScroll = (event: Object) => {

    let offsetY = event.nativeEvent.contentOffset.y;

    if (_.isNull(this.offsetY)) {
      this.offsetY = offsetY;
      return;
    }

    if (offsetY > this.offsetY) {
      this.loadPrev();
    }
    if (offsetY < this.offsetY) {
    }
    this.offsetY = offsetY;
  };

  render() {

    let {row, settings} = this.props;

    let listViewProps = {
      dataSource: this.state.dataSource,
      onEndReached: this.onEndReached,
      onScroll: this.handleScroll,
      renderRow: this.renderRow,
      scrollEventThrottle: 16
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
