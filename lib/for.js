/**
 * bright-flow
 *
 * @author 老雷<leizongmin@gmail.com>
 */


/**
 * for 流程控制对象
 *
 * @param {Function} cond
 * @return {Object}
 */
var flow = function (cond) {
  if (!(this instanceof flow)) return new flow(cond);
  this._cond = cond;
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
  
  me.done = function () {
    if (me._cond()) {
      me._call(me._fn);
    } else {
      me.break();
    }
  };

  me.break = function () {
    me._fn = null;
    me._cond = null;
    callback();
  };
  
  process.nextTick(function () {
    me.done();
  });
  
  return this;
};


module.exports = exports = flow;
