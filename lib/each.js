/**
 * bright-flow
 *
 * @module bright-flow
 * @author 老雷<leizongmin@gmail.com>
 */


/**
 * each 流程控制对象
 *
 * @class Each
 * @param {Array} arr
 * @return {Object}
 */
var flow = function (arr) {
  if (!(this instanceof flow)) return new flow(arr);
  this._arr = arr;
};

/**
 * 执行函数
 *
 * @param {Function} fn
 * @param {Array} args
 * @return {Object}
 */
flow.prototype._call = function (fn, args) {
  args = args || [];
  args.push(this);
  return fn.apply(this, args);
};

/**
 * do
 *
 * @method do
 * @param {Function} fn
 * @return {Object}
 */
flow.prototype.do = function (fn) {
  this._fn = fn;
  return this;
};

/**
 * timeout
 *
 * @method timeout
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
 * @method end
 * @param {Function} callback
 */
flow.prototype.end = function (callback) {
  var me = this;
  var tid = null;
  var hasReturn = false;

  if (Array.isArray(me._arr)) {
    var i = -1;
    var len = me._arr.length;
    var next = function () {
      i++;
      if (i < len) {
        return {index: i, value: me._arr[i]};
      } else {
        return null;
      }
    };
  } else {
    var keys = Object.keys(me._arr);
    var next = function () {
      var k = keys.shift();
      if (k) {
        return {index: k, value: me._arr[k]};
      } else {
        return null;
      }
    };
  }

  me.done = function () {
    if (hasReturn) return;
    var item = next();
    if (item) {
      me._call(me._fn, [item.value, item.index, me._arr, me.done]);
    } else {
      me.break();
    }
  };

  me.break = function () {
    if (hasReturn) return;
    hasReturn = true;
    if (tid) clearTimeout(tid);
    me._arr = null;
    me._fn = null;
    callback(!!me.isTimeout);
  };
  
  if (me._timeout > 0) {
    tid = setTimeout(function () {
      me.isTimeout = true;
      me.break();
    }, me._timeout);
  }

  // 保证是异步的
  process.nextTick(me.done);
  
  return this;
};


module.exports = exports = flow;
