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
    }).end(function () {
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
    }).end(function () {
      assert.deepEqual(data, [0,1,2,3,4,5]);
      done();
    });
  });

})