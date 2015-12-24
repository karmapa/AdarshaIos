import React, {Component, ScrollView, View, Text, PropTypes} from 'react-native';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {AdvanceSearchView, CategoryView, KeyboardSearchView} from '../components';
import {TabBarIOS, Spinner, Icon} from 'react-native-icons';
import {connect} from 'react-redux/native';
import {setSelectedTab} from '../modules/main';
import {styles, stylesTabBar} from './MasterView.style';
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
  }

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
          <TabBarIOS.Item title={'Category'} iconName={'ion|ios-book-outline'} iconSize={32}
            selected={'category' === selectedTab} onPress={this.onTabPress.bind(this, 'category')}>
            <CategoryView navigator={navigator} tocRows={tocRows} title={title} />
          </TabBarIOS.Item>
          <TabBarIOS.Item title={'Keyboard Search'} iconName={'ion|ios-search'} iconSize={32}
            selected={'keyboardSearch' === selectedTab} onPress={this.onTabPress.bind(this, 'keyboardSearch')}>
            <KeyboardSearchView navigator={navigator} />
          </TabBarIOS.Item>
          <TabBarIOS.Item title={'Advance Search'} iconName={'ion|social-buffer'} iconSize={32}
            selected={'advanceSearch' === selectedTab} onPress={this.onTabPress.bind(this, 'advanceSearch')}>
            {this.renderAdvance()}
          </TabBarIOS.Item>
        </TabBarIOS>
      </View>
    );
  }
}

export default MasterView;
