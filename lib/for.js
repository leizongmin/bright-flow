/**
 * ForFlow
 *
 * @module bright-flow
 * @author 老雷<leizongmin@gmail.com>
 */

var BaseFlow = require('./flow');

exports = module.exports = ForFlow;

/**
 * ForFlow 流程控制对象
 *
 * @class ForFlow
 * @param {Function} cond 可以为同步返回或异步：
 *                          function () { return true; }
 *                          function (callback) { callback(true); }         
 * @return {Object}
 */
function ForFlow (cond) {
  if (!(this instanceof ForFlow)) return new ForFlow(cond);
  this._super();
  if (cond.length > 0) {
    // 异步条件测试
    this._data.cond = cond;
  } else {
    // 同步条件测试
    this._data.cond = function (callback) {
      callback(cond());
    };
  }
  this._test = this._testCond.bind(this);
};

// 继承
BaseFlow.derive(ForFlow);

/**
 * do
 *
 * @method do
 * @param {Function} fn
 * @return {Object}
 */
ForFlow.prototype.do = function (fn) {
  this._data.fn = fn;
  return this;
};

/**
 * 完成一个步骤
 *
 * @method done
 * @param {Object} err
 */
ForFlow.prototype._done = function (err) {
  this._assert();
  if (err) return this._return(err);
  
  this._data.cond(this._test);
};

/**
 * 测试条件
 *
 * @param {Boolean} ok
 */
ForFlow.prototype._testCond = function (ok) {
  if (ok) {
    this._call(this._data.fn, [this.done]);
  } else {
    this._return();
  }
};

/**
 * end
 *
 * @method end
 * @param {Function} callback
 */
ForFlow.prototype.end = function (callback) {
  this._start(this.done, callback);
  return this;
};
