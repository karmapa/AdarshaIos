export default function isCrashStr(str) {
  return new RegExp(/^\d+[abcde]*\.\d+[abcd]$/).test(str);
}
