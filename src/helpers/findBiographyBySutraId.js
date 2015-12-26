import _ from 'lodash';
const biography = require('../../biography.json');

export default function findBiographyBySutraId(sutraId) {

  return _.chain(biography)
    .get('divisions')
    .pluck('sutras')
    .flatten()
    .find({sutraid: sutraId})
    .value();
}
