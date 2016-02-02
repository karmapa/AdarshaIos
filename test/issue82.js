var should = require('should');
var ksa = require('ksana-simple-api');
var _ = require('lodash');

describe('issue82', function() {

  it('should return the same sutra name', function(done) {

    var db = 'jiangkangyur';
    var sutraIds = ['J80'];
    var expectedSutraName = 'འཕགས་པ་རྡོ་རྗེའི་ཏིང་ངེ་འཛིན་གྱི་ཆོས་ཀྱི་ཡི་གེ།';

    ksa.getFieldRange({db: db, field: 'sutra', values: sutraIds}, function(err, rows) {

      var vposEnds = rows.map(function(row) {
        return row[1];
      });

      ksa.vpos2uti({db: db, vpos: vposEnds}, function(err, utis) {
        utis.should.deepEqual(['51.156a']);
        ksa.fetch({db: db, uti: utis}, function(err, rows) {
          var row = _.first(rows);
          ksa.toc({db: db, vpos: row['vpos_end']}, function(err, data) {
            var resultSutraName = _.get(data, 'breadcrumb[3].t');
            // Uncaught AssertionError: expected 'འཕགས་པ་ཁྱེའུ་བཞིའི་ཏིང་ངེ་འཛིན་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། ' to be 'འཕགས་པ་རྡོ་རྗེའི་ཏིང་ངེ་འཛིན་གྱི་ཆོས་ཀྱི་ཡི་གེ།'
            resultSutraName.should.equal(expectedSutraName);
            done();
          })
        });
      });
    });

  });

});
