;(function (global) {
  // 模块管理
  var modules = {};
  function require (name) {
    if (modules[name]) {
      return modules[name];
    } else {
      throw new Error('Cannot find module "' + name + '".');
    }
  }
  // 模拟util模块
  modules['util'] = {
    inherits: function(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  }
  // 模拟process
  var process = {
    nextTick: function (fn) {
      setTimeout(fn, 0);
    }
  }
var module = {exports: {}};
(function (module, exports) {
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

})(module, module.exports)
modules["./error"] = module.exports;

var module = {exports: {}};
(function (module, exports) {
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

})(module, module.exports)
modules["./flow"] = module.exports;

var module = {exports: {}};
(function (module, exports) {
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

})(module, module.exports)
modules["./if"] = module.exports;

var module = {exports: {}};
(function (module, exports) {
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

})(module, module.exports)
modules["./for"] = module.exports;

var module = {exports: {}};
(function (module, exports) {
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

})(module, module.exports)
modules["./each"] = module.exports;

var module = {exports: {}};
(function (module, exports) {
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

})(module, module.exports)
modules["./series"] = module.exports;

var module = {exports: {}};
(function (module, exports) {
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

})(module, module.exports)
modules["./parallel"] = module.exports;

var module = {exports: {}};
(function (module, exports) {
/**
 * bright-flow
 *
 * @author 老雷<leizongmin@gmail.com>
 */


exports.if = require('./if');
exports.for = require('./for');
exports.each = require('./each');
exports.series = require('./series');
exports.parallel = require('./parallel');
exports.BrightFlowError = require('./error');

})(module, module.exports)
modules["./index"] = module.exports;

  global.brightFlow = require('./index');
})(window);