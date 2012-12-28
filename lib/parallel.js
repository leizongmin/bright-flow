/**
 * bright-flow
 *
 * @author 老雷<leizongmin@gmail.com>
 */


/**
 * parallel 流程控制对象
 *
 * @param {Integer} maxThread
 * @return {Object}
 */
var flow = function (maxThread) {
  if (!(this instanceof flow)) return new flow(maxThread);
  this._thread = maxThread;
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
    callback(me.isTimeout);
  };
  if (me._timeout > 0) {
    tid = setTimeout(function () {
      me.isTimeout = true;
      me.break();
    }, me._timeout);
  }
  for (var i = 0; i < taskCount; i++) {
    call(me._fn.shift());
  }
  
  return this;
};


module.exports = exports = flow;
