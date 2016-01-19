export default function isValidUti(uti) {
  return !! uti.match(/^(\d+\.\d+)([abcd])$/);
}
