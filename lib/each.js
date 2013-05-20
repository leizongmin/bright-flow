/**
 * EachFlow
 *
 * @module bright-flow
 * @author 老雷<leizongmin@gmail.com>
 */

var BaseFlow = require('./flow');

exports = module.exports = EachFlow;

/**
 * EachFlow 流程控制对象
 *
 * @class EachFlow
 * @param {Array} arr
 * @return {Object}
 */
function EachFlow (arr) {
  if (!(this instanceof EachFlow)) return new EachFlow(arr);
  this._super();
  this._data.fn = [];
  this._data.source = arr;
  var array = this._data.array = [];
  var keys = this._data.keys = [];
  if (Array.isArray(arr)) {
    for (var i = 0; i < arr.length; i++) {
      array.push(arr[i]);
      keys.push(i);
    }
  } else {
    for (var i in arr) {
      array.push(arr[i]);
      keys.push(i);
    }
  }
};

// 继承
BaseFlow.derive(EachFlow);

/**
 * do
 *
 * @method do
 * @param {Function} fn
 * @return {Object}
 */
EachFlow.prototype.do = function (fn) {
  this._data.fn = fn;
  return this;
};

/**
 * 完成一个步骤
 *
 * @method done
 * @param {Object} err
 */
EachFlow.prototype._done = function (err) {
  this._assert();
  if (err) return this._return(err);
  
  var data = this._data;
  data.index++;
  if (data.index < data.length) {
    var i = data.index;
    this._call(data.fn, [data.array[i], data.keys[i], data.source, this.done]);
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
EachFlow.prototype.end = function (callback) {
  this._data.index = -1;
  this._data.length = this._data.array.length;
  this._start(this.done, callback);
  return this;
};
