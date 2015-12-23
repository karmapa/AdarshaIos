import wylie from 'tibetan/wylie';

export default function cleanKeyword(keyword) {

  if (keyword.match(/^\d+\.\d+[abcd]$/)) {
    return keyword;
  }

  // escape operators
  keyword = keyword.replace(/\\/g, '\\\\')
    .replace(/\*/, '**');

  keyword = wylie.fromWylieWithWildcard(keyword);
  keyword = wylie.fromWylie(keyword);
  keyword = keyword.replace(/༌༌/g, '*');

  return removeLoadingEndingSpace(keyword);
}

function removeLoadingEndingSpace(keyword) {
  if ((! keyword) || (keyword.length < 2)) {
    return keyword;
  }
  return keyword.replace(/^་/, '').replace(/་$/, '');
}
