/**
 * 测试 if
 */

var assert = require('assert');
var _ = require('../');

describe('#parallel', function () {
  
  it('#parallel - 1', function (done) {
    var sum = 0;
    _.parallel().do(function () {
      sum += 1;
      this.done();
    }).do(function () {
      sum += 2;
      this.done();
    }).do(function () {
      sum += 4;
      this.done();
    }).do(function () {
      sum += 8;
      this.done();
    }).end(function (isTimeout) {
      assert.notEqual(isTimeout, true);
      assert.equal(sum, 15);
      done();
    });
  });

  it('#parallel - 2', function (done) {
    var sum = 0;
    var timestamp = Date.now();
    _.parallel().do(function () {
      sum += 1;
      setTimeout(this.done.bind(this), 100);
    }).do(function () {
      sum += 2;
      setTimeout(this.done.bind(this), 100);
    }).do(function () {
      sum += 4;
      setTimeout(this.done.bind(this), 100);
    }).do(function () {
      sum += 8;
      setTimeout(this.done.bind(this), 100);
    }).end(function (isTimeout) {
      assert.notEqual(isTimeout, true);
      assert.equal(sum, 15);
      assert.ok(Date.now() - timestamp < 150);
      done();
    });
  });

  it('#parallel - break', function (done) {
    var sum = 0;
    _.parallel().do(function () {
      sum += 1;
      this.done();
    }).do(function () {
      sum += 2;
      this.done();
    }).do(function () {
      sum += 4;
      this.break();
    }).do(function () {
      sum += 8;
      this.done();
    }).end(function (isTimeout) {
      assert.notEqual(isTimeout, true);
      assert.equal(sum, 7);
      done();
    });
  });

  it('#parallel - timeout - 1', function (done) {
    var sum = 0;
    _.parallel().do(function () {
      sum += 1;
      this.done();
    }).do(function () {
      sum += 2;
      this.done();
    }).do(function () {
      sum += 4;
      this.done();
    }).do(function () {
      sum += 8;
    }).timeout(100).end(function (isTimeout) {
      assert.equal(isTimeout, true);
      assert.equal(sum, 15);
      done();
    });
  });

  it('#parallel - timeout - 2', function (done) {
    var sum = 0;
    _.parallel().do(function () {
      sum += 1;
    }).do(function () {
      sum += 2;
    }).do(function () {
      sum += 4;
    }).do(function () {
      sum += 8;
    }).timeout(100).end(function (isTimeout) {
      assert.equal(isTimeout, true);
      assert.equal(sum, 15);
      done();
    });
  });

})