'use strict';

import React, { Component, ScrollView, View, Text } from 'react-native';

import { connect } from 'react-redux/native';
import { TabBarIOS, Spinner, Icon} from 'react-native-icons';
import { styles } from './mainApp.style';

@connect(state => ({
  state: state.main
}))
class MainApp extends Component {

  constructor(props) {
    super(props);
  }

  state = {
    selectedTab: 'One'
  };

  onTabPress(selectedTab) {
    this.setState({selectedTab});
  }

  render() {

    return (
      <TabBarIOS tintColor={'#c1d82f'} barTintColor={'#000000'}>
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
      </TabBarIOS>
    );
  }
}

export default MainApp;
