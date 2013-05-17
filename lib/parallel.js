/**
 * ParallelFlow
 *
 * @module bright-flow
 * @author 老雷<leizongmin@gmail.com>
 */

var BaseFlow = require('./flow');

exports = module.exports = ParallelFlow;

/**
 * ParallelFlow 流程控制对象
 *
 * @class ParallelFlow
 * @return {Object}
 */
function ParallelFlow () {
  if (!(this instanceof ParallelFlow)) return new ParallelFlow();
  this._super();
  this._data.fn = [];
};

// 继承
BaseFlow.derive(ParallelFlow);

/**
 * do
 *
 * @method do
 * @param {Function} fn
 * @return {Object}
 */
ParallelFlow.prototype.do = function (fn) {
  this._data.fn.push(fn);
  return this;
};

/**
 * 完成一个步骤
 *
 * @method done
 * @param {Object} err
 */
ParallelFlow.prototype._done = function (err) {
  if (this._ignoreAll) return;
  this._assert();
  if (err) return this._return(err);
  
  this._doneCount++;
  if (this._doneCount >= this._taskCount) {
    this._return();
  }
};

/**
 * end
 *
 * @method end
 * @param {Function} callback
 */
ParallelFlow.prototype.end = function (callback) {
  var me = this;

  this._doneCount = 0;
  this._taskCount = this._data.fn.length;

  this._start(function () {
    me._data.fn.forEach(function (fn) {
      process.nextTick(function () {
        me._call(fn, [me.done]);
      });
    });
  }, function (err) {
    if (err) me._ignoreAll = true;
    callback(err);
  });

  return this;
};
