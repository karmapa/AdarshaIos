import {openDb, setFontSize, setLineHeight, setLoading, setWylieStatus} from '../modules/main';
import {openToc} from '../modules/category';
import React, {Component, Navigator, PropTypes, View, Image} from 'react-native';
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
  loading: state.main.get('loading')
}), {openDb, openToc, setLoading})
class MainApp extends Component {

  static PropTypes = {
    openDb: PropTypes.func.isRequired,
    openToc: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.preload();
  }

  async preload() {
    let {openDb, openToc, setLoading} = this.props;

    setLoading(true);
    await openDb();
    await openToc();
    setLoading(false);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {

    let navigatorProps = {
      style: styles.navigatorIos,
      initialRoute: {
        index: 0
      },
      renderScene: this.renderScene.bind(this)
    };

    return <Navigator {...navigatorProps} />;
  }

  renderScene = (route, navigator) => {

    const {setFontSize, setLineHeight, setWylieStatus} = this.props;

    if (this.props.loading) {
      return renderSpinner();
    }

    if ('DetailView' === route.name) {

      let detailViewProps = {
        fetchTitle: route.fetchTitle,
        message: route.message,
        navigator,
        route,
        rows: route.rows,
        title: route.title
      };

      return (
        <View style={[globalStyles.container, {backgroundColor: 'transparent', paddingTop: 0}]}>
          <Image style={styles.backgroundImage} resizeMode={Image.resizeMode.contain} source={require('image!bg-scripture')} />
          <View style={[globalStyles.container, {backgroundColor: 'transparent', paddingTop: 20}]}>
            <DetailView {...detailViewProps} />
          </View>
        </View>
      );
    }

    return (
      <View style={globalStyles.container}>
        <MasterView navigator={navigator} route={route} />
      </View>
    );
  };
}

export default MainApp;
