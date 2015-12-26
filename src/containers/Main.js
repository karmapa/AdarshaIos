import {openDb, setLoading, setSideMenuStatus} from '../modules/main';
import {openToc} from '../modules/category';
import SideMenu from 'react-native-side-menu';
import React, {Component, Navigator, PropTypes, View, Image} from 'react-native';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {CategoryView, DetailView, MasterView, Menu} from '../components';
import {DB_NAME} from '../constants/AppConstants';
import {Spinner} from 'react-native-icons';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux/native';
import {renderSpinner} from '../helpers';
import {styles as globalStyles} from '../styles/global.style';
import {styles} from './Main.style';

@connect(state => ({
  loading: state.main.get('loading'),
  isSideMenuOpen: state.main.get('isSideMenuOpen')
}), {openDb, openToc, setLoading, setSideMenuStatus})
class Main extends Component {

  static PropTypes = {
    openDb: PropTypes.func.isRequired,
    openToc: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    isSideMenuOpen: PropTypes.bool.isRequired,
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

  handleSideMenuChange = isOpen => {
    this.props.setSideMenuStatus(isOpen);
  };

  renderContent = (route, navigator) => {

    if ('DetailView' === route.name) {

      let detailViewProps = {
        fetchTitle: route.fetchTitle,
        message: route.message,
        navigator,
        route,
        rows: route.rows,
        title: route.title
      };

      return <DetailView {...detailViewProps} />;
    }
    return <MasterView navigator={navigator} route={route} />;
  };

  renderScene = (route, navigator) => {

    if (this.props.loading) {
      return renderSpinner();
    }

    let sideMenuProps = {
      isOpen: this.props.isSideMenuOpen,
      menu: (<Menu />),
      menuPosition: 'right',
      onChange: this.handleSideMenuChange
    };

    return (
      <SideMenu {...sideMenuProps}>
        {this.renderContent(route, navigator)}
      </SideMenu>
    );
  };

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
}

export default Main;
