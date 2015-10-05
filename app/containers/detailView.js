'use strict';

import React, { Text, Component, ScrollView, View, PropTypes, TouchableHighlight, Image } from 'react-native';

import { Spinner, Icon} from 'react-native-icons';
import { styles } from './detailView.style';
import shouldPureComponentUpdate from 'react-pure-render/function';

class DetailView extends Component {

  static PropTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    navigator: PropTypes.array.isRequired,
    route: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  goBack() {
    this.props.navigator.pop();
  }

  render() {

    let {title, text} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <TouchableHighlight onPress={this.goBack.bind(this)} style={styles.backButton} underlayColor={'#ecf0f1'}>
            <Icon name="ion|chevron-left" style={{width: 22, height: 22}} size={22} color={'#555555'} />
          </TouchableHighlight>
          <Text style={styles.title}>{title}</Text>
        </View>
        <ScrollView style={styles.textView}>
          <Text>{text}</Text>
        </ScrollView>
        <View style={styles.boxButton}>
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button]}>
            <Image style={styles.buttonImage} source={require('image!icon-line-height-minus')} />
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button]}>
            <Image style={styles.buttonImage} source={require('image!icon-line-height-add')} />
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button]}>
            <Image style={styles.buttonImage} source={require('image!icon-font-size-minus')} />
          </TouchableHighlight>
          <TouchableHighlight underlayColor={'#ecf0f1'} style={[styles.button]}>
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
