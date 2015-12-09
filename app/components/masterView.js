'use strict';

import React, {Component, ScrollView, View, Text, PropTypes} from 'react-native';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {AdvanceSearchView, CategoryView, KeyboardSearchView} from '../components';
import {TabBarIOS, Spinner, Icon} from 'react-native-icons';
import {connect} from 'react-redux/native';
import {setSelectedTab} from '../actions/mainActions';
import {styles, stylesTabBar} from './masterView.style';

@connect(() => ({}), {setSelectedTab})
class MasterView extends Component {

  static PropTypes = {
    navigator: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    setSelectedTab: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    advanceSearchSettings: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  onTabPress(selectedTab) {
    this.props.setSelectedTab(selectedTab);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  renderAdvance = () => {
    let {navigator, route, advanceSearchSettings, settings} = this.props;
    let {db, sutraMap} = settings;

    if ('AdvanceSearchView' === route.name) {
      return <CategoryView from={'AdvanceSearchView'} navigator={navigator} tocRows={route.tocRows} title={route.title} />;
    }
    return (
      <AdvanceSearchView db={db} sutraMap={sutraMap}
        advanceSearchSettings={advanceSearchSettings} navigator={navigator} />
    );
  }

  render() {

    let {tintColor, barTintColor} = stylesTabBar;
    let tabBarProps = {tintColor, barTintColor};
    let {selectedTab, db, tocRows, sutraMap} = this.props.settings;
    let {navigator, route} = this.props;
    let title;

    if ('CategoryView' === route.name) {
      tocRows = route.tocRows;
      title = route.title;
    }

    return (
      <TabBarIOS {...tabBarProps}>
        <TabBarIOS.Item title={'Category'} iconName={'ion|ios-book-outline'} iconSize={32}
          selected={'category' === selectedTab} onPress={this.onTabPress.bind(this, 'category')}>
          <CategoryView navigator={navigator} tocRows={tocRows} title={title} />
        </TabBarIOS.Item>
        <TabBarIOS.Item title={'Keyboard Search'} iconName={'ion|ios-search'} iconSize={32}
          selected={'keyboardSearch' === selectedTab} onPress={this.onTabPress.bind(this, 'keyboardSearch')}>
          <KeyboardSearchView db={db} />
        </TabBarIOS.Item>
        <TabBarIOS.Item title={'Advance Search'} iconName={'ion|social-buffer'} iconSize={32}
          selected={'advanceSearch' === selectedTab} onPress={this.onTabPress.bind(this, 'advanceSearch')}>
          {this.renderAdvance()}
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

export default MasterView;
