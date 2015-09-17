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

    return (
      <TabBarIOS {...tabBarProps}>
        <TabBarIOS.Item title={''} iconName={'ion|ios-book-outline'} iconSize={32}
            selected={'One' === this.state.selectedTab} onPress={this.onTabPress.bind(this, 'One')}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topContainer}>
              <Text>One</Text>
            </View>
          </ScrollView>
        </TabBarIOS.Item>
        <TabBarIOS.Item title={''} iconName={'ion|ios-search'} iconSize={32}
            selected={'Two' === this.state.selectedTab} onPress={this.onTabPress.bind(this, 'Two')}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topContainer}>
              <Text>Two</Text>
            </View>
          </ScrollView>
        </TabBarIOS.Item>
        <TabBarIOS.Item title={''} iconName={'ion|social-buffer'} iconSize={32}
            selected={'Three' === this.state.selectedTab} onPress={this.onTabPress.bind(this, 'Three')}>
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
