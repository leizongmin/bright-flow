/**
 * SeriesFlow
 *
 * @module bright-flow
 * @author 老雷<leizongmin@gmail.com>
 */

var BaseFlow = require('./flow');

exports = module.exports = SeriesFlow;

/**
 * SeriesFlow 流程控制对象
 *
 * @class SeriesFlow
 * @return {Object}
 */
function SeriesFlow () {
  if (!(this instanceof SeriesFlow)) return new SeriesFlow();
  this._super();
  this._data.fn = [];
};

// 继承
BaseFlow.derive(SeriesFlow);

/**
 * do
 *
 * @method do
 * @param {Function} fn
 * @return {Object}
 */
SeriesFlow.prototype.do = function (fn) {
  this._data.fn.push(fn);
  return this;
};

/**
 * 完成一个步骤
 *
 * @method done
 * @param {Object} err
 */
SeriesFlow.prototype._done = function (err) {
  this._assert();
  if (err) return this._return(err);
  
  if (this._data.fn.length > 0) {
    this._call(this._data.fn.shift(), [this.done]);
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
SeriesFlow.prototype.end = function (callback) {
  this._start(this.done, callback);
  return this;
};
