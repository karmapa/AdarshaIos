export default function getUtiParts(uti = '') {
  let matches = uti.match(/^(\d+\.\d+)([abcd])$/);
  matches[0] = parseFloat(matches[0]);
  return matches;
}
