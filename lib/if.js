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
 * @class If
 * @param {Boolean} cond
 * @return {Object}
 */
function IfFlow (cond) {
  if (!(this instanceof IfFlow)) return new IfFlow(cond);
  this._super();
  this._data.cond = [cond];
  this._data.fn = [];
};

// 继承
BaseFlow.derive(IfFlow);

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
 * @param {Boolean} cond
 * @return {Object}
 */
IfFlow.prototype.elseif = function (cond) {
  this._data.cond.push(cond);
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
  
  if (this._data.test) {
    this._return();
  } else if (this._data.cond.length < 1) {
    if (this._data.fn.length > 0) {
      this._call(this._data.fn.shift(), [this.done]);
    } else {
      this._return();
    }
  } else {
    this._data.test = this._data.cond.shift();
    if (this._data.test) {
      this._call(this._data.fn.shift(), [this.done]);
    } else {
      this._data.fn.shift();
      this.done();
    }
  }
};

/**
 * end
 *
 * @method end
 * @param {Function} callback
 */
IfFlow.prototype.end = function (callback) {
  this._data.test = false;
  this._start(this.done, callback);
  return this;
};
