import React, {Component, View, PropTypes, TouchableHighlight,
  Image, Text, Dimensions} from 'react-native';
import {increaseFontSize, decreaseFontSize, increaseLineHeight,
  decreaseLineHeight, toggleWylieStatus, setBackground} from '../modules/main';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {connect} from 'react-redux/native';
import {styles} from './Menu.style';
import {MENU_WIDTH} from '../constants/AppConstants';

const window = Dimensions.get('window');
const underlayColor = 'rgba(0, 0, 0, 0)';

@connect(state => ({
  lineHeight: state.main.get('lineHeight'),
  fontSize: state.main.get('fontSize'),
  wylieOn: state.main.get('wylieOn'),
  backgroundIndex: state.main.get('backgroundIndex'),
  orientation: state.main.get('orientation')
}), {
  decreaseFontSize,
  decreaseLineHeight,
  increaseFontSize,
  increaseLineHeight,
  setBackground,
  toggleWylieStatus
})
class Menu extends Component {

  static PropTypes = {
    decreaseFontSize: PropTypes.func.isRequired,
    decreaseLineHeight: PropTypes.func.isRequired,
    fontSize: PropTypes.number.isRequired,
    increaseFontSize: PropTypes.func.isRequired,
    increaseLineHeight: PropTypes.func.isRequired,
    lineHeight: PropTypes.number.isRequired,
    setBackground: PropTypes.func.isRequired,
    backgroundIndex: PropTypes.number.isRequired,
    orientation: PropTypes.string.isRequired,
    toggleWylieStatus: PropTypes.func.isRequired,
    wylieOn: PropTypes.bool.isRequired
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  setBackground = index => {
    this.props.setBackground(index);
  };

  getSelectedStyle = backgroundIndex => {
    if (this.props.backgroundIndex === backgroundIndex) {
      return styles.selected;
    }
    return {};
  };

  render() {

    let {
      decreaseFontSize,
      decreaseLineHeight,
      fontSize,
      increaseFontSize,
      increaseLineHeight,
      lineHeight,
      toggleWylieStatus,
      wylieOn,
      orientation
    } = this.props;

    let windowWidth = window.width;
    let windowHeight = window.height;

    if ('LANDSCAPE' === orientation) {
      [windowWidth, windowHeight] = [windowHeight, windowWidth];
    }

    const containerStyle = {
      height: windowHeight,
      width: windowWidth,
      paddingLeft: windowWidth - MENU_WIDTH
    };

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.menu}>

          <View style={[styles.item, styles.row]}>
            <TouchableHighlight underlayColor={underlayColor} style={styles.button} onPress={decreaseFontSize}>
              <Image style={styles.buttonImage} source={require('image!icon-font-size-minus')} />
            </TouchableHighlight>
            <Text style={styles.value}>{fontSize}</Text>
            <TouchableHighlight underlayColor={underlayColor} style={styles.button} onPress={increaseFontSize}>
              <Image style={styles.buttonImage} source={require('image!icon-font-size-add')} />
            </TouchableHighlight>
          </View>

          <View style={[styles.item, styles.row]}>
            <TouchableHighlight underlayColor={underlayColor} style={styles.button} onPress={decreaseLineHeight}>
              <Image style={styles.buttonImage} source={require('image!icon-line-height-minus')} />
            </TouchableHighlight>
            <Text style={styles.value}>{lineHeight}</Text>
            <TouchableHighlight underlayColor={underlayColor} style={styles.button} onPress={increaseLineHeight}>
              <Image style={styles.buttonImage} source={require('image!icon-line-height-add')} />
            </TouchableHighlight>
          </View>

          <View style={[styles.item, styles.row]}>
            <View style={styles.wylie}>
              <TouchableHighlight underlayColor={underlayColor} style={styles.button} onPress={toggleWylieStatus}>
                <Image style={styles.buttonImage} source={require('image!icon-tibetan-wylie-switch')} />
              </TouchableHighlight>
            </View>
            <Text style={styles.value}>{wylieOn ? 'Wylie' : 'Tibetan'}</Text>
          </View>

          <View style={[styles.item, styles.row, styles.boxBackgrounds]}>

            <TouchableHighlight underlayColor={underlayColor}
              style={styles.backgroundButton} onPress={this.setBackground.bind(this, 0)}>
              <View style={[styles.backgroundButtonImage, {backgroundColor: '#ffffff'}, this.getSelectedStyle(0)]} />
            </TouchableHighlight>

            <TouchableHighlight underlayColor={underlayColor}
              style={styles.backgroundButton} onPress={this.setBackground.bind(this, 1)}>
              <Image style={[styles.backgroundButtonImage, this.getSelectedStyle(1)]} source={require('image!bg-scripture')} />
            </TouchableHighlight>

            <TouchableHighlight underlayColor={underlayColor}
              style={styles.backgroundButton} onPress={this.setBackground.bind(this, 2)}>
              <Image style={[styles.backgroundButtonImage, this.getSelectedStyle(2)]} source={require('image!bg-scripture2')} />
            </TouchableHighlight>

          </View>

        </View>
      </View>
    );
  }
}

export default Menu;
