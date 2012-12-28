/**
 * 测试 if
 */

var assert = require('assert');
var _ = require('../');

describe('#series', function () {
  
  it('#series', function (done) {
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
    }).end(function (isTimeout) {
      assert.notEqual(isTimeout, true);
      assert.deepEqual(data, [1,2,3]);
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
    }).end(function (isTimeout) {
      assert.notEqual(isTimeout, true);
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
    }).timeout(100).end(function (isTimeout) {
      assert.equal(isTimeout, true);
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
    }).timeout(100).end(function (isTimeout) {
      assert.equal(isTimeout, true);
      assert.deepEqual(data, [1,2]);
      done();
    });
  });

})