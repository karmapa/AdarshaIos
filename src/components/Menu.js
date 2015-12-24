import React, {Component, View, PropTypes, TouchableHighlight, Image, Text} from 'react-native';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {connect} from 'react-redux/native';
import {styles} from './Menu.style';

const underlayColor = 'rgba(0, 0, 0, 0)';

class Menu extends Component {

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.menu}>

          <View style={[styles.item, styles.row]}>
            <TouchableHighlight underlayColor={underlayColor} style={styles.button} onPress={this.decreaseLineHeight}>
              <Image style={styles.buttonImage} source={require('image!icon-line-height-minus')} />
            </TouchableHighlight>
            <Text style={styles.value}>100</Text>
            <TouchableHighlight underlayColor={underlayColor} style={styles.button} onPress={this.increaseLineHeight}>
              <Image style={styles.buttonImage} source={require('image!icon-line-height-add')} />
            </TouchableHighlight>
          </View>

          <View style={[styles.item, styles.row]}>
            <TouchableHighlight underlayColor={underlayColor} style={styles.button} onPress={this.decreaseFontSize}>
              <Image style={styles.buttonImage} source={require('image!icon-font-size-minus')} />
            </TouchableHighlight>
            <Text style={styles.value}>100</Text>
            <TouchableHighlight underlayColor={underlayColor} style={styles.button} onPress={this.increaseFontSize}>
              <Image style={styles.buttonImage} source={require('image!icon-font-size-add')} />
            </TouchableHighlight>
          </View>

          <View style={[styles.item, styles.row]}>
            <View style={styles.wylie}>
              <TouchableHighlight underlayColor={underlayColor} style={styles.button} onPress={this.toggleWylieStatus}>
                <Image style={styles.buttonImage} source={require('image!icon-tibetan-wylie-switch')} />
              </TouchableHighlight>
            </View>
            <Text style={styles.value}>True</Text>
          </View>

        </View>
      </View>
    );
  }
}

export default Menu;
