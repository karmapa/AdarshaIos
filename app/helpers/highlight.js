import _ from 'lodash';
import React, {Text} from 'react-native';
import {styles} from '../styles/global.style';

export default function highlight(text, hits = []) {

  if (_.isEmpty(hits)) {
    return [<Text key={0}>{text}</Text>];
  }

  return hits.reduce((data, hit, index, arr) => {
    let {tags, pos} = data;
    let [start, length] = hit;
    if (start > pos) {
      tags.push(<Text key={pos}>{text.substring(pos, start)}</Text>);
    }
    tags.push(<Text key={'h' + pos} style={styles.highlight}>{text.substr(start, length)}</Text>);
    data.pos = start += length;
    if (index === (arr.length - 1)) {
      tags.push(<Text key={data.pos}>{text.substr(data.pos)}</Text>);
    }
    return data;
  }, {tags: [], pos: 0}).tags;
}
