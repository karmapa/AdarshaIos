import React, {Component, ListView, PropTypes, View, TouchableHighlight, Image} from 'react-native';
import _ from 'lodash';
import {Icon} from 'react-native-icons';
import {connect} from 'react-redux/native';
import {setLoading} from '../modules/main';
import {styles} from './CategoryView.style';
import {values, styles as globalStyles} from '../styles/global.style';
import {fetch, removeLatin} from '../helpers';
import {TibetanText} from '.';

@connect(() => ({}), {setLoading})
class CategoryView extends Component {

  static PropTypes = {
    from: PropTypes.bool,
    navigator: PropTypes.array.isRequired,
    setLoading: PropTypes.func.isRequired,
    title: PropTypes.string,
    tocRows: PropTypes.object.isRequired
  };

  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  };

  tocRows = [];

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.props.tocRows)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.tocRows !== nextProps.tocRows) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.tocRows)
      });
    }
  }

  onRowClicked = async row => {

    let {setLoading} = this.props;

    if ('AdvanceSearchView' === this.props.from) {
      this.props.navigator.push({
        name: 'DetailView',
        rows: [row]
      });
    }
    else if (_.isEmpty(row.children)) {

      setLoading(true);

      let rows = await fetch({vpos: row.vpos});
      let firstRow = _.first(rows);

      this.props.navigator.push({
        name: 'DetailView',
        rows: [firstRow]
      });

      setLoading(false);
    }
    else {
      this.props.navigator.push({
        name: 'CategoryView',
        title: row.t,
        tocRows: row.children
      });
    }
  };

  renderRow = row => {

    return (
      <TouchableHighlight key={row.index} underlayColor={values.underlayColor} onPress={this.onRowClicked.bind(this, row)}>
        <View style={[styles.rowView, {alignItems: 'center'}]}>
          <TibetanText style={styles.rowText}>{removeLatin(row.t)}</TibetanText>
          <Icon name="ion|chevron-right" style={styles.rowIcon} size={16} color={'#555555'} />
        </View>
      </TouchableHighlight>
    );
  };

  goBack = () => {
    this.props.navigator.pop();
  };

  renderSectionHeader = () => {

    if (this.canShowBackButton()) {
      return (
        <View style={styles.navbar}>
          <TouchableHighlight onPress={this.goBack} style={styles.backButton} underlayColor={values.underlayColor}>
            <Icon name="ion|chevron-left" style={globalStyles.navIcon} size={22} color={'#555555'} />
          </TouchableHighlight>
          <TibetanText style={styles.title}>{removeLatin(this.props.title)}</TibetanText>
        </View>
      );
    }
    else {
      return (
        <View style={styles.scriptureContainer}>
          <View style={styles.scriptureBody}>
            <Image style={styles.scriptureLogo} source={require('image!Icon-Small-50')} />
            <TibetanText>འཇང་བཀའ་འགྱུར།</TibetanText>
          </View>
        </View>
      );
    }
  };

  render() {

    let listViewProps = {
      dataSource: this.state.dataSource,
      renderRow: this.renderRow
    };

    return (
      <View style={styles.container}>
        {this.renderSectionHeader()}
        <ListView {...listViewProps} />
      </View>
    );
  }

  canShowBackButton = () => {
    return this.props.navigator.getCurrentRoutes().length > 1;
  };
}

export default CategoryView;
