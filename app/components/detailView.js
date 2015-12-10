'use strict';

import React, {Text, Component, ScrollView, View, PropTypes, TouchableHighlight, Image} from 'react-native';
import shouldPureComponentUpdate from 'react-pure-render/function';
import wylie from 'tibetan/wylie';
import {Icon} from 'react-native-icons';
import {styles} from './detailView.style';
import {values, styles as globalStyles} from '../styles/global.style';

class DetailView extends Component {

  static PropTypes = {
    navigator: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    row: PropTypes.array.isRequired,
    setFontSize: PropTypes.func.isRequired,
    setLineHeight: PropTypes.func.isRequired,
    setWylieStatus: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  goBack = () => {
    this.props.navigator.pop();
  }

  goHome = () => {
    this.props.navigator.popToTop();
  }

  decreaseFontSize = () => {
    let fontSize = this.props.settings.fontSize - 1;
    if (fontSize >= 0) {
      this.props.setFontSize(fontSize);
    }
  }

  increaseFontSize = () => {
    let fontSize = this.props.settings.fontSize + 1;
    if (fontSize < 30) {
      this.props.setFontSize(fontSize);
    }
  }

  decreaseLineHeight = () => {
    let lineHeight = this.props.settings.lineHeight - 0.1;
    if (lineHeight >= 0) {
      this.props.setLineHeight(lineHeight);
    }
  }

  increaseLineHeight = () => {
    let lineHeight = this.props.settings.lineHeight + 0.1;
    if (lineHeight < 30) {
      this.props.setLineHeight(lineHeight);
    }
  }

  toggleWylieStatus = () => {
    let status = this.props.settings.toWylie;
    this.props.setWylieStatus(! status);
  }

  render() {

    let {title, row, settings} = this.props;
    let {fontSize, lineHeight, toWylie} = settings;

    return (
      <View style={styles.container}>
        <View style={styles.nav}>
          <TouchableHighlight onPress={this.goBack} style={styles.navButton} underlayColor={values.underlayColor}>
            <Icon name="ion|chevron-left" style={globalStyles.navIcon} size={values.navIconSize} color={values.navIconColor} />
          </TouchableHighlight>
          <Text numberOfLines={1} style={styles.navTitle}>{title}</Text>
          <TouchableHighlight onPress={this.goHome} style={styles.navButton} underlayColor={values.underlayColor}>
            <Icon name="ion|home" style={globalStyles.navIcon} size={values.navIconSize} color={values.navIconColor} />
          </TouchableHighlight>
        </View>
        <ScrollView style={styles.textView}>
          <Text style={{fontSize, lineHeight: lineHeight * fontSize}}>{toWylie ? wylie.toWylie(row.text) : row.text}</Text>
        </ScrollView>
        <View style={styles.boxButton}>
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button]} onPress={this.decreaseLineHeight}>
            <Image style={styles.buttonImage} source={require('image!icon-line-height-minus')} />
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button]} onPress={this.increaseLineHeight}>
            <Image style={styles.buttonImage} source={require('image!icon-line-height-add')} />
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button]} onPress={this.decreaseFontSize}>
            <Image style={styles.buttonImage} source={require('image!icon-font-size-minus')} />
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button]} onPress={this.increaseFontSize}>
            <Image style={styles.buttonImage} source={require('image!icon-font-size-add')} />
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button]} onPress={this.toggleWylieStatus}>
            <Image style={styles.buttonImage} source={require('image!icon-tibetan-wylie-switch')} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default DetailView;
