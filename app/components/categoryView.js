'use strict';

import React, {Component, ListView, PropTypes, Text, View, TouchableHighlight} from 'react-native';
import _ from 'lodash';
import ksa from 'ksana-simple-api';
import {DB_NAME} from '../constants/AppConstants';
import {Icon} from 'react-native-icons';
import {Spinner} from 'react-native-icons';
import {connect} from 'react-redux/native';
import {setLoading} from '../modules/main';
import {styles} from './categoryView.style';
import {values, styles as globalStyles} from '../styles/global.style';
import {renderSpinner} from '../helpers';

@connect(() => ({}), {setLoading})
class CategoryView extends Component {

  static PropTypes = {
    from: PropTypes.bool,
    navigator: PropTypes.array.isRequired,
    setLoading: PropTypes.func.isRequired,
    title: PropTypes.string,
    tocRows: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    }),
    loading: false
  };

  tocRows = [];

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.props.tocRows)
    });
  }

  onRowClicked(row) {

    let {setLoading} = this.props;

    if ('AdvanceSearchView' === this.props.from) {
      this.props.navigator.push({
        name: 'DetailView',
        title: row.t,
        row
      });
    }
    else if (_.isEmpty(row.children)) {

      this.setState({loading: true});

      ksa.fetch({db: DB_NAME, vpos: row.vpos}, (err, rows) => {

        if (err) {
          throw err;
        }

        this.props.navigator.push({
          name: 'DetailView',
          title: row.t,
          row: _.first(rows)
        });
        this.setState({loading: false});
      });
    }
    else {
      this.props.navigator.push({
        name: 'CategoryView',
        title: row.t,
        tocRows: row.children
      });
    }
  }

  renderRow = row => {

    return (
      <TouchableHighlight key={row.index} underlayColor={values.underlayColor} onPress={this.onRowClicked.bind(this, row)}>
        <View style={[styles.rowView, {alignItems: 'center'}]}>
          <Text numberOfLines={2} style={{paddingLeft: 14, paddingTop: 10, paddingBottom: 10, flex: 1}}>{row.t}</Text>
          <Icon name="ion|chevron-right" style={{width: 16, height: 16, marginRight: 10}} size={16} color={'#555555'} />
        </View>
      </TouchableHighlight>
    );
  }

  onEndReached = () => {
    console.log('onEndReached');
  }

  goBack = () => {
    this.props.navigator.pop();
  }

  renderHeader = () => {

    if (this.canShowBackButton()) {
      return (
        <View style={styles.navbar}>
          <TouchableHighlight onPress={this.goBack} style={styles.backButton} underlayColor={values.underlayColor}>
            <Icon name="ion|chevron-left" style={globalStyles.navIcon} size={22} color={'#555555'} />
          </TouchableHighlight>
          <Text style={styles.title}>{this.props.title}</Text>
        </View>
      );
    }
    else {
      return <Text style={styles.scriptureName}>འཇང་བཀའ་འགྱུར།</Text>;
    }
  };

  render() {

    if (this.state.loading) {
      return renderSpinner();
    }

    let listViewProps = {
      dataSource: this.state.dataSource,
      onEndReached: this.onEndReached,
      renderHeader: this.renderHeader,
      renderRow: this.renderRow
    };

    return (
      <View style={[styles.container]}>
        <ListView {...listViewProps} />
      </View>
    );
  }

  canShowBackButton = () => {
    return this.props.navigator.getCurrentRoutes().length > 1;
  }
}

export default CategoryView;
