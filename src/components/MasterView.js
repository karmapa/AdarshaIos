import React, {Component, View, PropTypes, TabBarIOS} from 'react-native';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {AdvanceSearchView, CategoryView, KeyboardSearchView, Copyright} from '../components';
import {connect} from 'react-redux/native';
import {setSelectedTab} from '../modules/main';
import {stylesTabBar} from './MasterView.style';
import {styles as globalStyles} from '../styles/global.style';

@connect(state => ({
  selectedTab: state.main.get('selectedTab'),
  tocRows: state.category.get('tocRows')
}), {setSelectedTab})
class MasterView extends Component {

  static PropTypes = {
    navigator: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    setSelectedTab: PropTypes.func.isRequired,
    tocRows: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
  }

  onTabPress(selectedTab) {
    this.props.setSelectedTab(selectedTab);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  renderAdvance = () => {

    let {navigator, route} = this.props;

    if ('AdvanceSearchView' === route.name) {
      return <CategoryView from={'AdvanceSearchView'} navigator={navigator} tocRows={route.tocRows} title={route.title} />;
    }
    return (
      <AdvanceSearchView navigator={navigator} />
    );
  };

  render() {

    let {navigator, route, tocRows, selectedTab} = this.props;
    let title;

    if ('CategoryView' === route.name) {
      tocRows = route.tocRows;
      title = route.title;
    }

    return (
      <View style={globalStyles.container}>
        <TabBarIOS {...stylesTabBar}>
          <TabBarIOS.Item title={'Category'} icon={require('image!ion-ios-book-outline')} accessibilityLabel="Category"
            selected={'category' === selectedTab} onPress={this.onTabPress.bind(this, 'category')}>
            <CategoryView navigator={navigator} tocRows={tocRows} title={title} />
          </TabBarIOS.Item>
          <TabBarIOS.Item title={'Keyword Search'} icon={require('image!ion-ios-search')} accessibilityLabel="Keyword Search"
            selected={'keyboardSearch' === selectedTab} onPress={this.onTabPress.bind(this, 'keyboardSearch')}>
            <KeyboardSearchView navigator={navigator} />
          </TabBarIOS.Item>
          <TabBarIOS.Item title={'Advance Search'} icon={require('image!ion-social-buffer')} accessibilityLabel="Advance Search"
            selected={'advanceSearch' === selectedTab} onPress={this.onTabPress.bind(this, 'advanceSearch')}>
            {this.renderAdvance()}
          </TabBarIOS.Item>
          <TabBarIOS.Item title={'Copyright'} icon={require('image!ion-information-circled')} accessibilityLabel="Copyright"
            selected={'copyright' === selectedTab} onPress={this.onTabPress.bind(this, 'copyright')}>
            <Copyright />
          </TabBarIOS.Item>
        </TabBarIOS>
      </View>
    );
  }
}

export default MasterView;
