/**
 * Error
 *
 * @module bright-flow
 * @author 老雷<leizongmin@gmail.com>
 */

var util = require('util');

/**
 * 首字母大写
 *
 * @param {String} str
 * @return {String}
 */
function capitalize (str) {
  return str[0].toUpperCase() + str.substr(1);
};

/**
 * 创建一个Error对象
 *
 * @class BrightFlowError
 * @param {String} code
 * @param {String} message
 * @param {Function} stackStartFunction
 */
function BrightFlowError (code, message, stackStartFunction) {
  this.name = 'BrightFlowError';
  this.code = code;
  this.message = message || capitalize(code);
  Error.captureStackTrace(this, stackStartFunction);
}

util.inherits(BrightFlowError, Error);

exports = module.exports = BrightFlowError;

/**
 * TIMEOUT
 * @type String
 */
exports.TIMEOUT = 'timeout';

/**
 * BREAK
 * @type String
 */
exports.BREAK = 'break';

/**
 * MULTI_TIMES
 * @type String
 */
exports.MULTI_TIMES = 'multi_times';
