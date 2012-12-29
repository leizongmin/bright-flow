/**
 * bright-flow
 *
 * @author 老雷<leizongmin@gmail.com>
 */


/**
 * if 流程控制对象
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
  var cond = false;

  me.done = function () {
    if (cond) {
      me.break();
    } else if (me._cond.length < 1) {
      if (me._fn.length > 0) {
        me._call(me._fn.shift());
      } else {
        me.break();
      }
    } else {
      cond = me._cond.shift();
      if (cond) {
        me._call(me._fn.shift());
      } else {
        me._fn.shift();
        me.done();
      }
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
