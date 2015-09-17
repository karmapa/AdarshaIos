'use strict';

import React, { Component, ScrollView, View, Text, PropTypes } from 'react-native';

import { connect } from 'react-redux/native';
import { TabBarIOS, Spinner, Icon} from 'react-native-icons';
import { styles, stylesTabBar } from './mainApp.style';
import * as mainActions from '../actions/mainActions';

@connect(state => ({
  state: state.main
}))
class MainApp extends Component {

  static PropTypes = {
    state: PropTypes.object.isRequire,
    dispatch: PropTypes.func.isRequire
  };

  constructor(props) {
    super(props);
  }

  onTabPress(selectedTab) {
    this.setState({selectedTab});
  }

  render() {

    let {tintColor, barTintColor} = stylesTabBar;
    let tabBarProps = {tintColor, barTintColor};
    let {selectedTab} = this.props.state.toObject();

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
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topContainer}>
              <Text>Two</Text>
            </View>
          </ScrollView>
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

export default MainApp;
