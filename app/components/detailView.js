'use strict';

import React, { Text, Component, ScrollView, View, PropTypes, TouchableHighlight, Image } from 'react-native';

import { Icon } from 'react-native-icons';
import { styles } from './detailView.style';
import shouldPureComponentUpdate from 'react-pure-render/function';
import wylie from 'tibetan/wylie';

class DetailView extends Component {

  static PropTypes = {
    title: PropTypes.string.isRequired,
    rows: PropTypes.array.isRequired,
    navigator: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    setFontSize: PropTypes.func.isRequired,
    setLineHeight: PropTypes.func.isRequired,
    setWylieStatus: PropTypes.func.isRequired
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

    let {title, rows, settings} = this.props;
    let {fontSize, lineHeight, toWylie} = settings;

    let limitedRows = rows.filter((row, index) => {
      return index < 10;
    });

    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <View style={{width: 30}}>
            <TouchableHighlight onPress={this.goBack} style={{width: 30}} underlayColor={'#ecf0f1'}>
              <Icon name="ion|chevron-left" style={{width: 22, height: 22}} size={22} color={'#555555'} />
            </TouchableHighlight>
          </View>
          <Text numberOfLines={1} style={{flex: 1, textAlign: 'center'}}>{title}</Text>
          <View style={{width: 30}}>
            <TouchableHighlight onPress={this.goHome} style={{width: 30}} underlayColor={'#ecf0f1'}>
              <Icon name="ion|home" style={{width: 22, height: 22, alignSelf: 'center'}} size={22} color={'#555555'} />
            </TouchableHighlight>
          </View>
        </View>
        <ScrollView style={styles.textView}>
          {limitedRows.map((row, index) => <Text key={index} style={{fontSize, lineHeight: lineHeight * fontSize}}>{toWylie ? wylie.toWylie(row.text) : row.text}</Text>)}
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
