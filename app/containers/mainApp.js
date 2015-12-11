import {openDb, openToc, setFontSize, setLineHeight, setWylieStatus} from '../modules/main';
import React, {Component, Navigator, PropTypes, View} from 'react-native';
import _ from 'lodash';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {CategoryView, DetailView, MasterView} from '../components';
import {DB_NAME} from '../constants/AppConstants';
import {Spinner} from 'react-native-icons';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux/native';
import {styles as globalStyles} from '../styles/global.style';
import {styles} from './mainApp.style';

@connect(state => ({
  settings: state.main,
  advanceSearchSettings: state.advanceSearch
}), {openDb, openToc, setFontSize, setLineHeight, setWylieStatus})
class MainApp extends Component {

  static PropTypes = {
    openDb: PropTypes.func.isRequired,
    openToc: PropTypes.func.isRequired,
    setFontSize: PropTypes.func.isRequired,
    setLineHeight: PropTypes.func.isRequired,
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

    let navigatorProps = {
      style: styles.navigatorIos,
      initialRoute: {
        index: 0
      },
      renderScene: this.renderScene.bind(this, settings, advanceSearchSettings)
    };

    return <Navigator {...navigatorProps} />;
  }

  renderSpinner = () => {

    let spinnerProps = {
      name: 'ion|load-c',
      size: 24,
      color: '#777',
      style: globalStyles.spinner
    };

    return (
      <View style={globalStyles.viewSpinner}>
        <Spinner {...spinnerProps} />
      </View>
    );
  };

  renderScene(settings, advanceSearchSettings, route, navigator) {

    const {setFontSize, setLineHeight, setWylieStatus} = this.props;
    const {tocRows, loading} = settings;

    if (loading || _.isNull(tocRows)) {
      return this.renderSpinner();
    }

    if ('DetailView' === route.name) {

      let detailViewProps = {
        settings,
        navigator,
        route,
        setFontSize,
        setLineHeight,
        setWylieStatus,
        title: route.title,
        row: route.row,
        message: route.message
      };

      return (
        <View style={globalStyles.container}>
          <DetailView {...detailViewProps} />
        </View>
      );
    }

    let masterViewProps = Object.assign({
      settings,
      advanceSearchSettings,
      navigator,
      route
    });

    return (
      <View style={globalStyles.container}>
        <MasterView {...masterViewProps}></MasterView>
      </View>
    );
  }
}

export default MainApp;
