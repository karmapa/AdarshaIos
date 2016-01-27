import _ from 'lodash';
import React, {Text, Component} from 'react-native';
import {styles} from './TibetanText.style';

const StyleSheetRegistry = require('StyleSheetRegistry');
const textStyle = StyleSheetRegistry.getStyleByID(styles.text);

class TibetanText extends Component {

  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  render () {

    let props = _.clone(this.props);
    let style = props.style;

    if (_.isNumber(style)) {
      style = StyleSheetRegistry.getStyleByID(style);
    }

    if (_.isArray(style)) {
      props.style = style.concat(textStyle);
    }
    else {
      props.style = Object.assign({}, style, textStyle);
    }

    return <Text ref={component => this._root = component} {...props} />;
  }
}

export default TibetanText;
