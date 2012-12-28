/**
 * bright-flow
 *
 * @author 老雷<leizongmin@gmail.com>
 */


/**
 * if流程控制对象
 *
 * @param {Boolean} cond
 * @return {Object}
 */
var flow = function (cond) {
  if (!(this instanceof flow)) return new flow(cond);
  this._cond = [cond];
  this._fn = [];
};

/**
 * then
 *
 * @param {Function} fn
 * @return {Object}
 */
flow.prototype.then = function (fn) {
  this._fn.push(fn);
  return this;
};

/**
 * elseif
 *
 * @param {Boolean} cond
 * @return {Object}
 */
flow.prototype.elseif = function (cond) {
  this._cond.push(cond);
  return this;
};

/**
 * else
 *
 * @param {Function} fn
 * @return {Object}
 */
flow.prototype.else = function (fn) {
  this._fn.push(fn);
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
  var cond = false;
  this.done = function () {
    if (cond) {
      callback();
    } else if (me._cond.length < 1) {
      if (me._fn.length > 0) {
        call(me._fn.shift());
      } else {
        callback();
      }
    } else {
      cond = me._cond.shift();
      if (cond) {
        call(me._fn.shift());
      } else {
        me._fn.shift();
        me.done();
      }
    }
  };
  this.done();
  return this;
};


module.exports = exports = flow;
