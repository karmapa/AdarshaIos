import {openDb, setFontSize, setLineHeight, setLoading, setWylieStatus} from '../modules/main';
import {openToc} from '../modules/category';
import React, {Component, Navigator, PropTypes, View} from 'react-native';
import _ from 'lodash';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {CategoryView, DetailView, MasterView} from '../components';
import {DB_NAME} from '../constants/AppConstants';
import {Spinner} from 'react-native-icons';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux/native';
import {renderSpinner} from '../helpers';
import {styles as globalStyles} from '../styles/global.style';
import {styles} from './mainApp.style';

@connect(state => ({
  advanceSearchSettings: state.advanceSearch,
  settings: state.main
}), {openDb, openToc, setFontSize, setLoading, setLineHeight, setWylieStatus})
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

    let {openDb, openToc, setLoading} = this.props;

    setLoading(true);

    openDb(DB_NAME)
      .then(() => openToc(DB_NAME))
      .finally(() => {
        setLoading(false);
      });
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

  renderScene(settings, advanceSearchSettings, route, navigator) {

    const {setFontSize, setLineHeight, setWylieStatus} = this.props;
    const {loading} = settings;

    if (loading) {
      return renderSpinner();
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
        rows: route.rows,
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
