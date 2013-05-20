/**
 * Base Flow Object
 * 
 * @module bright-flow
 * @author 老雷<leizongmin@gmail.com>
 */

var BrightFlowError = require('./error');


exports.BaseFlow = BaseFlow;

/**
 * 派生
 *
 * 子类必须实现 _done, end 这两个方法
 * 在初始化时，调用 this._super() 来初始化
 * this._data 用于保存用户数据，在流程被销毁时会自动清空
 *
 * @method dervie
 * @param
 */
exports.derive = function (c) {
  for (var i in BaseFlow.prototype) {
    c.prototype[i] = BaseFlow.prototype[i];
  }
  c.prototype._super = BaseFlow;
};

/**
 * 基本流程控制对象
 *
 * @class BaseFlow
 */
function BaseFlow () {
  this._returned = false;
  this.done = this._done.bind(this);
  this._data = {};
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
 * @param {Object} err 若设置了此参数，则不使用默认的BrightFlowError对象
 */
BaseFlow.prototype.break = function (err) {
  var err = arguments.length > 0 ? err : new BrightFlowError(BrightFlowError.BREAK);
  this._return(err);  
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

  // 如果有定时器，则删除
  if (this._tid) clearTimeout(this._tid);

  var cb = this._data.callback;

  // 回收资源
  this._returned = true;
  this.destroy();

  cb(err);
};

/**
 * 释放资源
 *
 * @method destroy
 */
BaseFlow.prototype.destroy = function () {
  this._data = null;
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

  this._data.callback = callback;

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
