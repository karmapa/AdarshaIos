export default function removeLatin(str = '') {
  return str.replace(/[\u0041-\u007a\u00c0-\u02b8\u1e00-\u1ffc]+/g, '');
}
