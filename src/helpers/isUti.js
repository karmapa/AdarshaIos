export default function isUti(str) {
  return new RegExp(/^\d+\.\d+[abcd]$/).test(str);
}
