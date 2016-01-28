import _ from 'lodash';

export default function getUti(row) {
  return _.get(row, 'uti') || _.get(row, 'segname');
}
