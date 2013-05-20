/**
 * ForFlow
 *
 * @module bright-flow
 * @author 老雷<leizongmin@gmail.com>
 */

var BaseFlow = require('./flow');
var BrightFlowError = require('./error');

exports = module.exports = ForFlow;

/**
 * ForFlow 流程控制对象
 *
 * @class ForFlow
 * @param {Function} cond
 * @return {Object}
 */
function ForFlow (cond) {
  if (!(this instanceof ForFlow)) return new ForFlow(cond);
  this._super();
  this._data.fn = [];
  this._data.cond = cond;
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
  
  if (this._data.cond()) {
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
  this._start(this.done, function (err) {
    if (err && err.code === BrightFlowError.BREAK) {
      // break错误是属于正常退出，此处应该忽略它
      err = null;
    }
    callback(err);
  });
  return this;
};
