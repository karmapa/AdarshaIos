import _ from 'lodash';
import {isUti} from '.';

export default function getUti(row) {
  let uti = _.get(row, 'uti') || _.get(row, 'segname');
  return isUti(uti) ? uti : '';
}
