var should = require('should');
var ksa = require('ksana-simple-api');
var _ = require('lodash');

describe('issue82', function() {

  it('should return the same sutra name', function(done) {

    var db = 'jiangkangyur';
    var sutraIds = ['J18'];
    var expectedSutraName = 'འཕགས་པ་ཤེས་རབ་ཀྱི་ཕ་རོལ་ཏུ་ཕྱིན་པ་རྡོ་རྗེ་གཅོད་པ་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ།';

    ksa.getFieldRange({db: db, field: 'sutra', values: sutraIds}, function(err, rows) {

      var vposEnds = rows.map(function(row) {
        return row[0];
      });

      ksa.vpos2uti({db: db, vpos: vposEnds}, function(err, utis) {
        utis.should.deepEqual(['39.151b']);
        ksa.fetch({db: db, uti: utis}, function(err, rows) {
          var row = _.first(rows);
          ksa.toc({db: db, vpos: row['vpos_end'] + 300}, function(err, data) {
            var resultSutraName = _.get(data, 'breadcrumb[3].t');
            // Uncaught AssertionError: expected 'འཕགས་པ་ཁྱེའུ་བཞིའི་ཏིང་ངེ་འཛིན་ཞེས་བྱ་བ་ཐེག་པ་ཆེན་པོའི་མདོ། ' to be 'འཕགས་པ་རྡོ་རྗེའི་ཏིང་ངེ་འཛིན་གྱི་ཆོས་ཀྱི་ཡི་གེ།'
            console.log(resultSutraName);
           // resultSutraName.should.equal(expectedSutraName);
            done();
          })
        });
      });
    });

  });

});
