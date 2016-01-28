export default function isCrashStr(str) {
  // https://github.com/ksanaforge/ksana-simple-api/issues/5
  // string that are able to crash ksana iOS native module
  // 108a.1a
  // 1.1a
  // 1-1
  // 1
  return new RegExp(/^(\d+[abcd]*\.\d+[abcd])|(\d+\-\d+)|(\d+)$/).test(str);
}
