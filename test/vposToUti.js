var should = require('should');
var ksa = require('ksana-simple-api');

describe('ksa.vpos2uti', function() {

  it('should return multiple utis', function(done) {

    var db = 'jiangkangyur';
    var sutraIds = ['J18', 'J80', 'J84', 'J355a', 'J422', 'J454a', 'J455',
      'J459', 'J460', 'J461', 'J463', 'J466', 'J524', 'J627', 'J691', 'J715',
      'J717', 'J718', 'J720', 'J823', 'J832', 'J863', 'J865', 'J866', 'J872', 'J905'];

    ksa.getFieldRange({db: db, field: 'sutra', values: sutraIds}, function(err, rows) {

      var vposEnds = rows.map(function(row) {
        return row[1];
      });

      ksa.vpos2uti({db: db, vpos: vposEnds}, function(err, utis) {
        utis.length.should.be.above(1);
        done();
      });
    });

  });

});
