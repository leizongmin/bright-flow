/**
 * 测试 each
 */

var assert = require('assert');
var _ = require('../');

describe('#each', function () {
  
  it('array', function (done) {
    var data = [];
    _.each([1,2,3,4,5]).do(function (v, i) {
      data.push(i + ':' + v);
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.deepEqual(data, ['0:1','1:2','2:3','3:4','4:5']);
      done();
    });
  });

  it('object', function (done) {
    var data = [];
    _.each({a:1, b:2, c:3, d:4, e:5}).do(function (v, i) {
      data.push(i + ':' + v);
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.deepEqual(data, ['a:1','b:2','c:3','d:4','e:5']);
      done();
    });
  });

  it('array - break', function (done) {
    var data = [];
    _.each([1,2,3,4,5]).do(function (v, i) {
      if (v > 3) {
        this.break();
      } else {
        data.push(i + ':' + v);
        this.done();
      }
    }).end(function (err) {
      assert.notEqual(err, null);
      assert.equal(err.code, _.BrightFlowError.BREAK);
      assert.deepEqual(data, ['0:1','1:2','2:3']);
      done();
    });
  });
  
  it('timeout', function (done) {
    _.each([1,2,3,4,5,6,7,8,9,10]).do(function () {
      var me = this;
      setTimeout(function () {
        if (!me._returned) {
          me.done();
        }
      }, 20);
    }).timeout(100).end(function (err) {
      assert.notEqual(err, null);
      assert.equal(err.code, _.BrightFlowError.TIMEOUT);
      done();
    });
  });

  it('done & done(err)', function (done) {
    var err = new Error('Wahaha');
    _.each([1,2,3,4,5]).do(function (v, i, arr, done) {
      done(err);
    }).end(function (err2) {
      assert.equal(err, err2);
      done();
    })
  });

})