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
  var isBreak = false;
  me.done = function () {
    if (isBreak) return;
    if (me._fn.length > 0) {
      call(me._fn.shift());
    } else {
      me.break();
    }
  };
  me.break = function () {
    if (isBreak) return;
    isBreak = true;
    if (tid) clearTimeout(tid);
    callback();
  };
  if (me._timeout > 0) {
    tid = setTimeout(function () {
      me.break();
    }, me._timeout);
  }
  me.done();
  return this;
};


module.exports = exports = flow;
