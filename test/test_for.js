/**
 * 测试 for
 */

var assert = require('assert');
var _ = require('../');

describe('#for', function () {
  
  it('for', function (done) {
    var i = 0;
    var data = [];
    _.for(function () {
      return i < 10;
    }).do(function () {
      data.push(i);
      i++;
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.deepEqual(data, [0,1,2,3,4,5,6,7,8,9]);
      done();
    });
  });

  it('for - break', function (done) {
    var i = 0;
    var data = [];
    _.for(function () {
      return i < 10;
    }).do(function () {
      if (i > 5) {
        this.break();
      } else {
        data.push(i);
        i++;
        this.done();
      }
    }).end(function (err) {
      assert.equal(err, null);
      assert.deepEqual(data, [0,1,2,3,4,5]);
      done();
    });
  });
  
  it('timeout', function (done) {
    _.for(function () {
      return true;
    }).do(function () {
      var me = this;
      setTimeout(function () {
        if (!me._returned) {
          me.done();
        }
      }, 10);
    }).timeout(100).end(function (err) {
      assert.notEqual(err, null);
      assert.equal(err.code, _.BrightFlowError.TIMEOUT);
      done();
    });
  });

  it('done & done(err)', function (done) {
    var err = new Error('Wahaha');
    _.for(function () {
      return true;
    }).do(function (done) {
      done(err);
    }).end(function (err2) {
      assert.equal(err, err2);
      done();
    })
  });

})