import React, {Component, View, PropTypes, TouchableHighlight, Image, Text} from 'react-native';
import {increaseFontSize, decreaseFontSize, increaseLineHeight, decreaseLineHeight, toggleWylieStatus} from '../modules/detailView';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {connect} from 'react-redux/native';
import {styles} from './Menu.style';

const underlayColor = 'rgba(0, 0, 0, 0)';

@connect(state => ({
  lineHeight: state.detailView.get('lineHeight'),
  fontSize: state.detailView.get('fontSize'),
  wylieOn: state.detailView.get('wylieOn')
}), {
  decreaseFontSize,
  decreaseLineHeight,
  increaseFontSize,
  increaseLineHeight,
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
    toggleWylieStatus: PropTypes.func.isRequired,
    wylieOn: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {

    let {
      decreaseFontSize,
      decreaseLineHeight,
      fontSize,
      increaseFontSize,
      increaseLineHeight,
      lineHeight,
      toggleWylieStatus,
      wylieOn
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.menu}>

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
            <TouchableHighlight underlayColor={underlayColor} style={styles.button} onPress={decreaseFontSize}>
              <Image style={styles.buttonImage} source={require('image!icon-font-size-minus')} />
            </TouchableHighlight>
            <Text style={styles.value}>{fontSize}</Text>
            <TouchableHighlight underlayColor={underlayColor} style={styles.button} onPress={increaseFontSize}>
              <Image style={styles.buttonImage} source={require('image!icon-font-size-add')} />
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

        </View>
      </View>
    );
  }
}

export default Menu;
