import wylie from 'tibetan/wylie';

export default function cleanKeyword(keyword = '') {

  if (keyword.match(/^\d+\.\d+[abcd]$/)) {
    return keyword;
  }

  return wylie.fromWylieWithWildcard(keyword);
}
