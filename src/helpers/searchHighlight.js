import _ from 'lodash';
import React, {Text} from 'react-native';
import {values} from '../styles/global.style';
import {getHighlightStyle} from '.';

export default function searchHighlight(text, searchKeyword) {

  const highlightStyle = getHighlightStyle(0);

  let children = [];
  let index = 0;
  let lastEnd = 0;
  let match;
  let regex = new RegExp(searchKeyword, 'g');

  while (match = regex.exec(text)) {

    let start = match.index;
    let end = start + searchKeyword.length;

    if (lastEnd !== end) {
      children.push(<Text ref={'s' + index}>{text.substring(lastEnd, start)}</Text>);
    }
    children.push(<Text ref={'s' + index} style={highlightStyle}>{text.substring(start, end)}</Text>);
    lastEnd = end;
    index++;
  }
  children.push(<Text ref={'s' + index}>{text.substring(lastEnd, text.length)}</Text>);
  return children;
}
