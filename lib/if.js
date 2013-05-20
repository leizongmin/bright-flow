/**
 * IfFlow
 *
 * @module bright-flow
 * @author 老雷<leizongmin@gmail.com>
 */

var BaseFlow = require('./flow');

exports = module.exports = IfFlow;

/**
 * if 流程控制对象
 *
 * @class IfFlow
 * @param {Boolean} cond
 * @return {Object}
 */
function IfFlow (cond) {
  if (!(this instanceof IfFlow)) return new IfFlow(cond);
  this._super();
  this._data.cond = [this._formatCond(cond)];
  this._data.fn = [];
  this._test = this._testCond.bind(this);
};

// 继承
BaseFlow.derive(IfFlow);

/**
 * 格式化测试条件
 *
 * @param {Boolean|Function} cond 可以为布尔值、同步或异步函数：
 *                            true
 *                            function () { return true; }
 *                            function (callback) { callback(true); } 
 * @return {Function}
 */
IfFlow.prototype._formatCond = function (cond) {
  if (typeof cond === 'function') {
    if (cond.length > 0) {
      return cond;
    } else {
      return function (callback) {
        callback(cond());
      }
    }
  } else {
    return function (callback) {
      callback(cond);
    };
  }
};

/**
 * then
 *
 * @method then
 * @param {Function} fn
 * @return {Object}
 */
IfFlow.prototype.then = function (fn) {
  this._data.fn.push(fn);
  return this;
};

/**
 * elseif
 *
 * @method elseif
 * @param {Boolean|Function} cond
 * @return {Object}
 */
IfFlow.prototype.elseif = function (cond) {
  this._data.cond.push(this._formatCond(cond));
  return this;
};

/**
 * else
 *
 * @method else
 * @param {Function} fn
 * @return {Object}
 */
IfFlow.prototype.else = function (fn) {
  this._data.fn.push(fn);
  return this;
};

/**
 * 完成一个步骤
 *
 * @method done
 * @param {Object} err
 */
IfFlow.prototype._done = function (err) {
  this._assert();
  if (err) return this._return(err);
  /*
  if (this._data.test) {
    // 执行成功一次即退出判断
    this._return();
  } else if (this._data.cond.length < 1) {
    // 后面已经没有其他条件判断
    if (this._data.fn.length > 0) {
      // 还有Else部分
      this._call(this._data.fn.shift(), [this.done]);
    } else {
      // 没有else部分，直接返回
      this._return();
    }
  } else {
    // 继续判断下一个条件
    this._data.test = this._data.cond.shift();
    if (this._data.test) {
      // 判断成功则执行
      this._call(this._data.fn.shift(), [this.done]);
    } else {
      // 不成功则忽略
      this._data.fn.shift();
      this.done();
    }
  }
  */

  // 如果已测试成功，直接返回
  if (this._data.test) {
    return this._return();
  }

  if (this._data.cond.length > 0) {
    // 若后面还有待测试的条件，则继续判断
    var cond = this._data.cond.shift();
    cond(this._test);
  } else if (this._data.fn.length > 0) {
    // 若有else部分，则先执行
    this._call(this._data.fn.shift(), [this.done]);
  } else {
    this._return();
  }
};

/**
 * 测试条件
 *
 * @param {Boolean} ok
 */
IfFlow.prototype._testCond = function (ok) {
  this._data.test = ok;

  if (ok) {
    // 测试成功，执行当前函数，并返回
    this._call(this._data.fn.shift(), [this.done]);
    
  } else {
    // 测试失败，忽略当前函数
    this._data.fn.shift();
    this.done();
  }
};

/**
 * end
 *
 * @method end
 * @param {Function} callback
 */
IfFlow.prototype.end = function (callback) {
  this._start(this.done, callback);
  return this;
};
