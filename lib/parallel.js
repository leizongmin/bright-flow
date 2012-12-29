/**
 * bright-flow
 *
 * @author 老雷<leizongmin@gmail.com>
 */


/**
 * parallel 流程控制对象
 *
 * @return {Object}
 */
var flow = function () {
  if (!(this instanceof flow)) return new flow();
  this._fn = [];
};

/**
 * 执行函数
 *
 * @param {Function} fn
 * @param {Array} args
 * @return {Object}
 */
flow.prototype._call = function (fn, args) {
  return fn.apply(this, args);
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
  var tid = null;
  var hasReturn = false;
  var doneCount = 0;
  var taskCount = me._fn.length;

  me.done = function () {
    if (hasReturn) return;
    doneCount++;
    if (doneCount >= taskCount) {
      me.break();
    }
  };

  me.break = function () {
    if (hasReturn) return;
    hasReturn = true;
    if (tid) clearTimeout(tid);
    me._fn = null;
    callback(me.isTimeout);
  };

  if (me._timeout > 0) {
    tid = setTimeout(function () {
      me.isTimeout = true;
      me.break();
    }, me._timeout);
  }

  for (var i = 0; i < taskCount; i++) {
    (function (fn) {
      process.nextTick(function () {
        me._call(fn);
      });
    })(me._fn.shift());
  }

  return this;
};


module.exports = exports = flow;
