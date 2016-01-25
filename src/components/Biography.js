import React, {Component, PropTypes, Text, View, ScrollView,
  TouchableHighlight, Image, LayoutAnimation} from 'react-native';
import _ from 'lodash';
import {Icon} from 'react-native-icons';
import {connect} from 'react-redux/native';
import {setHasScrolled, loadBiographyByVpos, fields, setToolbarStatus} from '../modules/biography';
import {renderSpinner} from '../helpers';
import {styles} from './Biography.style';
import {values, styles as globalStyles} from '../styles/global.style';

const fontColor = '#ffffff';
const underlayColor = 'rgba(0, 0, 0, 0)';

@connect(state => ({
  biography: state.biography.get('biography'),
  hasScrolled: state.biography.get('hasScrolled'),
  isLoading: state.biography.get('isLoading'),
  toolbarOn: state.biography.get('toolbarOn')

}), {loadBiographyByVpos, setToolbarStatus, setHasScrolled})
class Biography extends Component {

  static PropTypes = {
    biography: PropTypes.object.isRequired,
    hasScrolled: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    loadBiographyByVpos: PropTypes.func.isRequired,
    navigator: PropTypes.array.isRequired,
    setHasScrolled: PropTypes.func.isRequired,
    setToolbarStatus: PropTypes.func.isRequired,
    title: PropTypes.string,
    toolbarOn: PropTypes.bool.isRequired,
    vpos: PropTypes.number.isRequired
  };

  componentWillMount() {
    this.props.loadBiographyByVpos(this.props.vpos);
    LayoutAnimation.spring();
  }

  componentDidMount() {
    this.isScrolling = false;
  }

  componentWillUnmount() {
    this.props.setHasScrolled(false);
  }

  goBack = () => {
    this.props.navigator.pop();
  };

  setToolbarStatus = toolbarOn => {
    LayoutAnimation.spring();
    this.props.setToolbarStatus(toolbarOn);
  };

  handleScroll = event => {
    this.isScrolling = true;
    if (this.props.toolbarOn && this.props.hasScrolled) {
      this.setToolbarStatus(false);
    }
    this.props.setHasScrolled(true);
  };

  handlePress = () => {
    this.setToolbarStatus(! this.props.toolbarOn);
  };

  handleTouchStart = () => {
    this.isScrolling = false;
  };

  handleTouchEnd = () => {
    if (! this.isScrolling) {
      this.handlePress();
    }
    this.isScrolling = false;
  };

  renderField = () => {
    let {biography} = this.props;
    return fields.map(field => {
      let content = biography ? biography[field.key] : '';
      if (_.isEmpty(content)) {
        return;
      }
      return (
        <View key={'f-' + field.key}>
          <View style={styles.heading}>
            <Text style={styles.headingText}>{field.name}</Text>
          </View>
          <View style={styles.content}>
            <Text>{biography ? biography[field.key] : ''}</Text>
          </View>
        </View>
      );
    });
  };

  render() {

    if (this.props.isLoading) {
      return renderSpinner();
    }

    let scrollViewProps = {
      style: styles.scrollView,
      onScroll: this.handleScroll,
      onTouchStart: this.handleTouchStart,
      scrollEventThrottle: 16,
      onTouchEnd: this.handleTouchEnd
    };

    return (
      <View style={[globalStyles.transparentContainer, {paddingTop: 0}]}>
        <View style={globalStyles.backgroundImageContainer}>
          <Image style={globalStyles.cover} resizeMode="cover" source={require('image!bg-scripture')} />
        </View>
        <View style={styles.container}>
          <ScrollView {...scrollViewProps}>
            {this.renderField()}
          </ScrollView>
          <View style={[styles.nav, {top: this.props.toolbarOn ? 0 : -60}]}>
            <TouchableHighlight onPress={this.goBack} style={styles.navButton} underlayColor={underlayColor}>
              <Icon name="ion|chevron-left" style={globalStyles.navIcon} size={values.navIconSize} color={fontColor} />
            </TouchableHighlight>
            <Text numberOfLines={1} style={styles.navTitle}>{this.props.title}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default Biography;
