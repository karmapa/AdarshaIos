'use strict';

import React, { Component, ScrollView, View, Text, PropTypes } from 'react-native';

import { TabBarIOS, Spinner, Icon} from 'react-native-icons';
import { styles, stylesTabBar } from './masterView.style';
import * as mainActions from '../actions/mainActions';
import { KeyboardSearchView } from '../components';
import shouldPureComponentUpdate from 'react-pure-render/function';

class MasterView extends Component {

  static PropTypes = {
    settings: PropTypes.object.isRequired,
    setSelectedTab: PropTypes.func.isRequired
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
    let {selectedTab, db} = this.props.settings;


    return (
      <TabBarIOS {...tabBarProps}>
        <TabBarIOS.Item title={'Category'} iconName={'ion|ios-book-outline'} iconSize={32}
            selected={'category' === selectedTab} onPress={this.onTabPress.bind(this, 'category')}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topContainer}>
              <Text>One</Text>
            </View>
          </ScrollView>
        </TabBarIOS.Item>
        <TabBarIOS.Item title={'Keyboard Search'} iconName={'ion|ios-search'} iconSize={32}
            selected={'keyboardSearch' === selectedTab} onPress={this.onTabPress.bind(this, 'keyboardSearch')}>
          <KeyboardSearchView db={db} />
        </TabBarIOS.Item>
        <TabBarIOS.Item title={'Advanced Search'} iconName={'ion|social-buffer'} iconSize={32}
            selected={'advancedSearch' === selectedTab} onPress={this.onTabPress.bind(this, 'advancedSearch')}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topContainer}>
              <Text>Two</Text>
            </View>
          </ScrollView>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

export default MasterView;
