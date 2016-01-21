import {getUtiParts} from '.';

export default function utiLessThan(uti1 = '', uti2 = '') {
  let [num1, char1] = getUtiParts(uti1);
  let [num2, char2] = getUtiParts(uti2);

  if (num1 === num2) {
    return char1 < char2;
  }
  return num1 < num2;
}
