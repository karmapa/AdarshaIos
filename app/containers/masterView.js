'use strict';

import React, { Component, ScrollView, View, Text, PropTypes } from 'react-native';

import { TabBarIOS, Spinner, Icon} from 'react-native-icons';
import { styles, stylesTabBar } from './masterView.style';
import * as mainActions from '../actions/mainActions';
import { AdvancedSearchView, CategoryView, KeyboardSearchView } from '../components';
import shouldPureComponentUpdate from 'react-pure-render/function';

class MasterView extends Component {

  static PropTypes = {
    navigator: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    setSelectedTab: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  onTabPress(selectedTab) {
    this.props.setSelectedTab(selectedTab);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {

    let {tintColor, barTintColor} = stylesTabBar;
    let tabBarProps = {tintColor, barTintColor};
    let {selectedTab, db, toc} = this.props.settings;
    let {navigator, route} = this.props;

    return (
      <TabBarIOS {...tabBarProps}>
        <TabBarIOS.Item title={'Category'} iconName={'ion|ios-book-outline'} iconSize={32}
            selected={'category' === selectedTab} onPress={this.onTabPress.bind(this, 'category')}>
          <CategoryView navigator={navigator} toc={toc} route={route} />
        </TabBarIOS.Item>
        <TabBarIOS.Item title={'Keyboard Search'} iconName={'ion|ios-search'} iconSize={32}
            selected={'keyboardSearch' === selectedTab} onPress={this.onTabPress.bind(this, 'keyboardSearch')}>
          <KeyboardSearchView db={db} />
        </TabBarIOS.Item>
        <TabBarIOS.Item title={'Advanced Search'} iconName={'ion|social-buffer'} iconSize={32}
            selected={'advancedSearch' === selectedTab} onPress={this.onTabPress.bind(this, 'advancedSearch')}>
          <AdvancedSearchView db={db} />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

export default MasterView;
