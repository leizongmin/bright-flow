/**
 * 测试 if
 */

var assert = require('assert');
var _ = require('../');

describe('#if', function () {
  
  it('if - 1', function (done) {
    var ret = null;
    _.if(true).then(function () {
      ret = 123456;
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.equal(ret, 123456);
      done();
    });
  });

  it('if - 2', function (done) {
    var ret = null;
    _.if(false).then(function () {
      ret = 123456;
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.equal(ret, null);
      done();
    });
  });

  it('if - sync condition', function (done) {
    var ret = null;
    _.if(function () {
      return false;
    }).then(function () {
      ret = 123456;
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.equal(ret, null);
      done();
    });
  });

  it('if - async condition', function (done) {
    var ret = null;
    _.if(function (callback) {
      setTimeout(function () {
        callback(false);
      }, 10);
    }).then(function () {
      ret = 123456;
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.equal(ret, null);
      done();
    });
  });

  it('if - else - 1', function (done) {
    var ret = null;
    _.if(true).then(function () {
      ret = 123;
      this.done();
    }).else(function () {
      ret = 456;
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.equal(ret, 123);
      done();
    });
  });
  
  it('if - else - 2', function (done) {
    var ret = null;
    _.if(false).then(function () {
      ret = 123;
      this.done();
    }).else(function () {
      ret = 456;
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.equal(ret, 456);
      done();
    });
  });

  it('if - elseif - else - 1', function (done) {
    var ret = null;
    _.if(true).then(function () {
      ret = 123;
      this.done();
    }).elseif(true).then(function () {
      ret = 456;
      this.done();
    }).else(function () {
      ret = 789;
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.equal(ret, 123);
      done();
    });
  });

  it('if - elseif - else - 2', function (done) {
    var ret = null;
    _.if(false).then(function () {
      ret = 123;
      this.done();
    }).elseif(true).then(function () {
      ret = 456;
      this.done();
    }).else(function () {
      ret = 789;
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.equal(ret, 456);
      done();
    });
  });

  it('if - elseif - else - 3', function (done) {
    var ret = null;
    _.if(false).then(function () {
      ret = 123;
      this.done();
    }).elseif(false).then(function () {
      ret = 456;
      this.done();
    }).else(function () {
      ret = 789;
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.equal(ret, 789);
      done();
    });
  });

  it('if - elseif - 1', function (done) {
    var ret = null;
    _.if(true).then(function () {
      ret = 123;
      this.done();
    }).elseif(true).then(function () {
      ret = 456;
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.equal(ret, 123);
      done();
    });
  });

  it('if - elseif - 2', function (done) {
    var ret = null;
    _.if(false).then(function () {
      ret = 123;
      this.done();
    }).elseif(true).then(function () {
      ret = 456;
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.equal(ret, 456);
      done();
    });
  });

  it('if - elseif - 1', function (done) {
    var ret = null;
    _.if(false).then(function () {
      ret = 123;
      this.done();
    }).elseif(false).then(function () {
      ret = 456;
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.equal(ret, null);
      done();
    });
  });

  it('if - elseif - elseif - 1', function (done) {
    var ret = null;
    _.if(true).then(function () {
      ret = 123;
      this.done();
    }).elseif(true).then(function () {
      ret = 456;
      this.done();
    }).elseif(true).then(function () {
      ret = 789;
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.equal(ret, 123);
      done();
    });
  });

  it('if - elseif - elseif - 2', function (done) {
    var ret = null;
    _.if(false).then(function () {
      ret = 123;
      this.done();
    }).elseif(true).then(function () {
      ret = 456;
      this.done();
    }).elseif(true).then(function () {
      ret = 789;
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.equal(ret, 456);
      done();
    });
  });

  it('if - elseif - elseif - 3', function (done) {
    var ret = null;
    _.if(false).then(function () {
      ret = 123;
      this.done();
    }).elseif(false).then(function () {
      ret = 456;
      this.done();
    }).elseif(true).then(function () {
      ret = 789;
      this.done();
    }).end(function (err) {
      assert.equal(err, null);
      assert.equal(ret, 789);
      done();
    });
  });

  it('timeout - 1', function (done) {
    var ret = null;
    _.if(true).then(function () {
      ret = 123456;
    }).timeout(100).end(function (err) {
      assert.notEqual(err, null);
      assert.equal(err.code, _.BrightFlowError.TIMEOUT);
      assert.equal(ret, 123456);
      done();
    });
  });

  it('done & done(err)', function (done) {
    var err = new Error('Wahaha');
    _.if(true).then(function (done) {
      done(err);
    }).end(function (err2) {
      assert.equal(err, err2);
      done();
    })
  });

})