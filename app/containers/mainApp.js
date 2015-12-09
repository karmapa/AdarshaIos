import * as advanceSearchActions from '../actions/advanceSearchActions';
import * as mainActions from '../actions/mainActions';
import React, {Component, Navigator, PropTypes, View} from 'react-native';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {CategoryView, DetailView, MasterView} from '../components';
import {DB_NAME} from '../constants/AppConstants';
import {Spinner} from 'react-native-icons';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux/native';
import {styles} from './mainApp.style';
import {styles as globalStyles} from '../styles/global.style';

@connect(state => ({
  settings: state.main,
  advanceSearchSettings: state.advanceSearch
}), mainActions)
class MainApp extends Component {

  static PropTypes = {
    openDb: PropTypes.func.isRequired,
    openToc: PropTypes.func.isRequired,
    setFontSize: PropTypes.func.isRequired,
    setLineHeight: PropTypes.func.isRequired,
    setLoading: PropTypes.func.isRequired,
    setWylieStatus: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let {openDb, openToc} = this.props;
    openDb(DB_NAME);
    openToc(DB_NAME);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {

    let settings = this.props.settings.toObject();
    let advanceSearchSettings = this.props.advanceSearchSettings.toObject();
    let {db, tocRows} = settings;

    let navigatorProps = {
      style: styles.navigatorIos,
      initialRoute: {
        index: 0
      },
      renderScene: this.renderScene.bind(this, settings, advanceSearchSettings)
    };

    if (db && tocRows) {
      return (
        <Navigator {...navigatorProps} />
      );
    }

    let spinnerProps = {
      name: 'ion|load-c',
      size: 24,
      color: '#777',
      style: globalStyles.spinner
    };

    return (
      <View style={styles.viewSpinner}>
        <Spinner {...spinnerProps} />
      </View>
    );
  }

  renderScene(settings, advanceSearchSettings, route, navigator) {

    const {setFontSize, setLineHeight, setWylieStatus} = this.props;

    if ('DetailView' === route.name) {

      let detailViewProps = {
        settings,
        navigator,
        route,
        setFontSize,
        setLineHeight,
        setWylieStatus,
        title: route.title,
        rows: route.rows,
        message: route.message
      };

      return (
        <DetailView {...detailViewProps} />
      );
    }

    let masterViewProps = Object.assign({
      settings,
      advanceSearchSettings,
      navigator,
      route
    });

    return (
      <MasterView {...masterViewProps}></MasterView>
    );
  }
}

export default MainApp;
