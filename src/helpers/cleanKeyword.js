import wylie from 'tibetan/wylie';
import {isPbId} from '.';

export default function cleanKeyword(keyword = '') {

  if (isPbId(keyword)) {
    return keyword;
  }

  return wylie.fromWylieWithWildcard(keyword);
}
