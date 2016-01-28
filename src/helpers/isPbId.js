export default function isCrashStr(str) {
  return new RegExp(/^\d+[abcd]*\.\d+[abcd]$/).test(str);
}
