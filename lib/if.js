/**
 * If
 *
 * @module bright-flow
 * @author 老雷<leizongmin@gmail.com>
 */


/**
 * if 流程控制对象
 *
 * @class If
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
  args = args || [];
  args.push(this);
  return fn.apply(this, args);
};

/**
 * then
 *
 * @method then
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
 * @method elseif
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
 * @method else
 * @param {Function} fn
 * @return {Object}
 */
flow.prototype.else = function (fn) {
  this._fn.push(fn);
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
  var cond = false;
  var tid = null;
  var hasReturn = false;

  me.done = function () {
    if (hasReturn) return;
    if (cond) {
      me.break();
    } else if (me._cond.length < 1) {
      if (me._fn.length > 0) {
        me._call(me._fn.shift(), [me.done]);
      } else {
        me.break();
      }
    } else {
      cond = me._cond.shift();
      if (cond) {
        me._call(me._fn.shift(), [me.done]);
      } else {
        me._fn.shift();
        me.done();
      }
    }
  };

  me.break = function () {
    if (hasReturn) return;
    hasReturn = true;
    if (tid) clearTimeout(tid);
    me._fn = null;
    me._cond = null;
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
