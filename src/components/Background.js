import React, {Component, PropTypes, View} from 'react-native';
import {connect} from 'react-redux/native';
import {styles as globalStyles} from '../styles/global.style';
import {styles} from './Background.style';

@connect(state => ({
  backgroundIndex: state.main.get('backgroundIndex')
}))
class Background extends Component {

  static PropTypes = {
    backgroundIndex: PropTypes.number.isRequired
  };

  renderBackgroundImage = () => {
    switch (this.props.backgroundIndex) {
      case 0:
        return <View style={styles.whiteBackground} />;
      case 1:
        return <Image style={globalStyles.cover} resizeMode="cover" source={require('image!bg-scripture')} />;
      case 2:
        return <Image style={globalStyles.cover} resizeMode="cover" source={require('image!bg-scripture2')} />;
    }
  };

  render() {

    return (
      <View style={globalStyles.backgroundImageContainer}>
        {this.renderBackgroundImage()}
      </View>
    );
  }
}

export default Background;
