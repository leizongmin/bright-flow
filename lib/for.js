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

  me.done = function () {
    if (me._cond()) {
      call(me._fn);
    } else {
      me.break();
    }
  };

  me.break = function () {
    callback();
  };
  
  me.done();
  return this;
};


module.exports = exports = flow;
