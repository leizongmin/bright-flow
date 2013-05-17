/**
 * Base Flow Object
 * 
 * @author 老雷<leizongmin@gmail.com>
 */

var BrightFlowError = require('./error');


exports.BaseFlow = BaseFlow;

/**
 * 派生
 *
 * 子类必须实现 _done, end 这两个方法
 * 在初始化时，调用 this._super() 来初始化
 */
exports.derive = function (c) {
  for (var i in BaseFlow.prototype) {
    c.prototype[i] = BaseFlow.prototype[i];
  }
  c.prototype._super = BaseFlow;
};

/**
 * 基本流程控制对象
 */
function BaseFlow () {
  this._returned = false;
  this.done = this._done.bind(this);
}

/**
 * 执行函数
 *
 * @param {Function} fn
 * @param {Array} args
 * @return {Object}
 */
BaseFlow.prototype._call = function (fn, args) {
  args = args || [];
  args.push(this);
  return fn.apply(this, args);
};

/**
 * 超时
 *
 * @method timeout
 * @param {Integer} ms
 * @return {Object}
 */
BaseFlow.prototype.timeout = function (ms) {
  this._timeout = ms;
  return this;
};

/**
 * 中断
 *
 * @method break
 */
BaseFlow.prototype.break = function () {
  this._return(new BrightFlowError(BrightFlowError.BREAK));  
};

/**
 * 判断是否出错
 *
 * @method _assert
 */
BaseFlow.prototype._assert = function () {
  if (this._returned) {
    throw new BrightFlowError(BrightFlowError.MULTI_TIMES, 'callback() has been called');
  }
};

/**
 * 调用回调函数
 *
 * @method _return
 * @param {Object} err
 */
BaseFlow.prototype._return = function (err) {
  this._assert();
  err = err || null;
  if (this._tid) clearTimeout(this._tid);
  this._callback(err);
  this._returned = true;
  this.destroy();
};

/**
 * 释放资源
 *
 * @method destroy
 */
BaseFlow.prototype.destroy = function () {
  for (var i in this) {
    this[i] = null;
  }
};

/**
 * 开始
 *
 * @method _start
 * @param {Function} init
 * @param {Function} callback
 */
BaseFlow.prototype._start = function (init, callback) {
  var me = this;

  this._callback = callback;

  // 超时处理
  if (me._timeout > 0) {
    this._tid = setTimeout(function () {
      me._return(new BrightFlowError(BrightFlowError.TIMEOUT));
    }, me._timeout);
  }
  
  // 保证是异步的
  process.nextTick(init);
  
  return this;
};
