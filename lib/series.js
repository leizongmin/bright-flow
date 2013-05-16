/**
 * Series
 *
 * @module bright-flow
 * @author 老雷<leizongmin@gmail.com>
 */

var BrightFlowError = require('./error');

/**
 * series 流程控制对象
 *
 * @class Series
 * @return {Object}
 */
var flow = function () {
  if (!(this instanceof flow)) return new flow();
  this._fn = [];
  this._returned = false;
  this.done = this._done.bind(this);
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
 * 释放资源
 *
 * @method destroy
 */
flow.prototype.destroy = function () {
  this._fn = null;
  this._callback = null;
};

/**
 * 完成一个步骤
 *
 * @method done
 * @param {Object} err
 */
flow.prototype._done = function (err) {
  this._assert();
  if (err) return this._return(err);
  
  if (this._fn.length > 0) {
    this._call(this._fn.shift(), [this.done]);
  } else {
    this._return();
  }
};

/**
 * 中断
 *
 * @method break
 */
flow.prototype.break = function () {
  this._return(new BrightFlowError(BrightFlowError.BREAK));  
};

/**
 * 判断是否出错
 */
flow.prototype._assert = function () {
  if (this._returned) {
    throw new BrightFlowError(BrightFlowError.MULTI_TIMES, 'callback() has been called');
  }
};

/**
 * 调用回调函数
 *
 * @param {Object} err
 */
flow.prototype._return = function (err) {
  this._assert();
  err = err || null;
  if (this._tid) clearTimeout(this._tid);
  this._callback(err);
  this._returned = true;
  this.destroy();
};

/**
 * end
 *
 * @method end
 * @param {Function} callback
 */
flow.prototype.end = function (callback) {
  var me = this;

  this._callback = callback;

  if (me._timeout > 0) {
    this._tid = setTimeout(function () {
      me._return(new BrightFlowError(BrightFlowError.TIMEOUT));
    }, me._timeout);
  }
  
  // 保证是异步的
  process.nextTick(me.done);
  
  return this;
};


module.exports = exports = flow;
