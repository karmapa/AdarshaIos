'use strict';

import React, { Text, Component, ScrollView, View, PropTypes, TouchableHighlight, Image } from 'react-native';

import { Spinner, Icon} from 'react-native-icons';
import { styles } from './detailView.style';
import shouldPureComponentUpdate from 'react-pure-render/function';

class DetailView extends Component {

  static PropTypes = {
    uti: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    navigator: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    setFontSize: PropTypes.func.isRequired,
    setLineHeight: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  goBack() {
    this.props.navigator.pop();
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
    console.log('incraseLineHeight', lineHeight);
    if (lineHeight < 30) {
      console.log('increase');
      this.props.setLineHeight(lineHeight);
    }
  }

  render() {

    let {title, text, settings} = this.props;
    let {fontSize, lineHeight} = settings;

    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <TouchableHighlight onPress={this.goBack.bind(this)} style={styles.backButton} underlayColor={'#ecf0f1'}>
            <Icon name="ion|chevron-left" style={{width: 22, height: 22}} size={22} color={'#555555'} />
          </TouchableHighlight>
          <Text style={styles.title}>{title}</Text>
        </View>
        <ScrollView style={styles.textView}>
          <Text style={{fontSize, lineHeight: lineHeight * fontSize}}>{text}</Text>
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
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button]}>
            <Image style={styles.buttonImage} source={require('image!icon-tibetan-wylie-switch')} />
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default DetailView;
