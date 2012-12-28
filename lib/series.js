/**
 * bright-flow
 *
 * @author 老雷<leizongmin@gmail.com>
 */


/**
 * series 流程控制对象
 *
 * @return {Object}
 */
var flow = function () {
  if (!(this instanceof flow)) return new flow();
  this._fn = [];
};

/**
 * do
 *
 * @param {Function} fn
 * @return {Object}
 */
flow.prototype.do = function (fn) {
  this._fn.push(fn);
  return this;
};

/**
 * timeout
 *
 * @param {Integer} ms
 * @return {Object}
 */
flow.prototype.timeout = function (ms) {
  this._timeout = ms;
  return this;
};

/**
 * end
 *
 * @param {Function} callback
 */
flow.prototype.end = function (callback) {
  var me = this;

  var call = function (fn, args) {
    return fn.apply(me, args);
  };

  var tid = null;
  var hasReturn = false;

  me.done = function () {
    if (hasReturn) return;
    if (me._fn.length > 0) {
      call(me._fn.shift());
    } else {
      me.break();
    }
  };

  me.break = function () {
    if (hasReturn) return;
    hasReturn = true;
    if (tid) clearTimeout(tid);
    callback(me.isTimeout);
  };
  if (me._timeout > 0) {
    tid = setTimeout(function () {
      me.isTimeout = true;
      me.break();
    }, me._timeout);
  }
  
  me.done();
  return this;
};


module.exports = exports = flow;
