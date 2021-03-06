/**
 * 测试 if
 */

var assert = require('assert');
var _ = require('../');

describe('#series', function () {
  
  it('#series - 1', function (done) {
    var data = [];
    _.series().do(function () {
      data.push(1);
      this.done();
    }).do(function () {
      data.push(2);
      this.done();
    }).do(function () {
      data.push(3);
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.deepEqual(data, [1,2,3]);
      done();
    });
  });

  it('#series - 2', function (done) {
    var data = [];
    var timestamp = Date.now();
    _.series().do(function () {
      data.push(1);
      setTimeout(this.done.bind(this), 100);
    }).do(function () {
      data.push(2);
      setTimeout(this.done.bind(this), 100);
    }).do(function () {
      data.push(3);
      setTimeout(this.done.bind(this), 100);
    }).end(function (err) {
      assert.equal(err, null);
      assert.deepEqual(data, [1,2,3]);
      assert.ok(Date.now() - timestamp >= 300)
      done();
    });
  });
  
  it('#series - break', function (done) {
    var data = [];
    _.series().do(function () {
      data.push(1);
      this.done();
    }).do(function () {
      data.push(2);
      this.break();
    }).do(function () {
      data.push(3);
      this.done();
    }).end(function (err) {
      assert.notEqual(err, null);
      assert.equal(err.code, _.BrightFlowError.BREAK);
      assert.deepEqual(data, [1,2]);
      done();
    });
  });

  it('#series - break - no error', function (done) {
    var data = [];
    _.series().do(function () {
      data.push(1);
      this.done();
    }).do(function () {
      data.push(2);
      this.break(null);
    }).do(function () {
      data.push(3);
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.deepEqual(data, [1,2]);
      done();
    });
  });

  it('#series - timeout - 1', function (done) {
    var data = [];
    _.series().do(function () {
      data.push(1);
      this.done();
    }).do(function () {
      data.push(2);
      this.done();
    }).do(function () {
      data.push(3);
    }).timeout(100).end(function (err) {
      assert.notEqual(err, null)
      assert.equal(err.code, _.BrightFlowError.TIMEOUT);
      assert.deepEqual(data, [1,2,3]);
      done();
    });
  });

  it('#series - timeout - 2', function (done) {
    var data = [];
    _.series().do(function () {
      data.push(1);
      this.done();
    }).do(function () {
      data.push(2);
    }).do(function () {
      data.push(3);
    }).timeout(100).end(function (err) {
      assert.notEqual(err, null);
      assert.equal(err.code, _.BrightFlowError.TIMEOUT);
      assert.deepEqual(data, [1,2]);
      done();
    });
  });

  it('#error', function (done) {
    var reterr = new Error('Test');
    _.series().do(function () {
      this.done(reterr);
    }).do(function () {
      throw new Error('Do not run here');
    }).end(function (err) {
      assert.equal(err, reterr);
      done();
    })
  });

  it('done & done(err)', function (done) {
    var err = new Error('Wahaha');
    _.series().do(function (done) {
      done(err);
    }).end(function (err2) {
      assert.equal(err, err2);
      done();
    })
  });

  it('#series - delay', function (done) {
    var data = [];
    var s = Date.now();
    _.series().do(function (done) {
      data.push(1);
      done();
    }).do(function (done) {
      data.push(2);
      done();
    }).do(function (done) {
      data.push(3);
      done();
    }).delay(100).end(function (err) {
      var e = Date.now();
      assert.equal(err, null);
      assert.deepEqual(data, [1,2,3]);
      assert.ok(e - s >= 100);
      done();
    });
  });

})