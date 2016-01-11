import _ from 'lodash';
import {values} from '../styles/global.style';

export default function getHighlightStyle(nWord) {
  const colors = values.highlightColors;
  const color = colors[nWord];
  return color ? color : _.first(colors);
}
