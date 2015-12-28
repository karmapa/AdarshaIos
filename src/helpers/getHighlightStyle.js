import _ from 'lodash';
import {values} from '../styles/global.style';

export default function getHighlightStyle(nWord) {
  const color = values.highlightColors[nWord];
  return color ? color : _.first(colors);
}
