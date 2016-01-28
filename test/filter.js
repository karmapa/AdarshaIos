var should = require('should');
var ksa = require('ksana-simple-api');
var wylie = require('tibetan/wylie');

describe('ksa.filter', function() {

  it('should have 1.7b for keyword "ga dag"', function(done) {

    ksa.filter({
      db: 'jiangkangyur',
     'phrase_sep': '།',
      q: wylie.fromWylieWithWildcard('ga dag')
    }, cb);

    function cb(err, rows) {

      var utis = rows.map(function(row) {
        return row.uti;
      });

      utis.should.containDeep(['1.2a', '1.135b', '1.7b']);

      done();
    }
  });

});
