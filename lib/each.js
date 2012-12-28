/**
 * bright-flow
 *
 * @author 老雷<leizongmin@gmail.com>
 */


/**
 * each 流程控制对象
 *
 * @param {Array} arr
 * @return {Object}
 */
var flow = function (arr) {
  if (!(this instanceof flow)) return new flow(arr);
  this._arr = arr;
};

/**
 * do
 *
 * @param {Function} fn
 * @return {Object}
 */
flow.prototype.do = function (fn) {
  this._fn = fn;
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
  this.done = function () {
    var item = next();
    if (item) {
      call(me._fn, [item.value, item.index, me._arr]);
    } else {
      me.break();
    }
  };
  this.break = function () {
    callback();
  };
  this.done();
  return this;
};


module.exports = exports = flow;
