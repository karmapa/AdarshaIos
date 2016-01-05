import {openDb, setLoading, setSideMenuStatus, loadStorage} from '../modules/main';
import {openToc} from '../modules/category';
import SideMenu from 'react-native-side-menu';
import React, {Component, Navigator, PropTypes, View, Image} from 'react-native';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {Biography, CategoryView, DetailView, MasterView, Menu} from '../components';
import {connect} from 'react-redux/native';
import {renderSpinner, storage, attachKeyboard} from '../helpers';
import {styles as globalStyles} from '../styles/global.style';
import {styles} from './Main.style';

@connect(state => ({
  isLoading: state.main.get('isLoading'),
  isSideMenuOpen: state.main.get('isSideMenuOpen')
}), {openDb, openToc, loadStorage, setLoading, setSideMenuStatus})
@attachKeyboard
class Main extends Component {

  static PropTypes = {
    openDb: PropTypes.func.isRequired,
    openToc: PropTypes.func.isRequired,
    loadStorage: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isSideMenuOpen: PropTypes.bool.isRequired,
    setLoading: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.preload();
  }

  async preload() {

    let {openDb, openToc, setLoading, loadStorage} = this.props;

    try {
      setLoading(true);
      await loadStorage();
      await openToc();
      await openDb();
      setLoading(false);
    }
    catch (e) {
      console.error('preload err: ', e);
    }
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  handleSideMenuChange = isOpen => {
    this.props.setSideMenuStatus(isOpen);
  };

  renderContent = (route, navigator) => {

    if ('Biography' === route.name) {
      return <Biography uti={route.uti} navigator={navigator} title={route.title} />
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

      return <DetailView {...detailViewProps} />;
    }
    return <MasterView navigator={navigator} route={route} />;
  };

  renderScene = (route, navigator) => {

    if (this.props.isLoading) {
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
