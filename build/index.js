/**
 * Build
 * 
 * @author 老雷<leizongmin@gmail.com>
 */

var path = require('path');
var fs = require('fs');
var UglifyJS = require('uglify-js');

process.chdir(path.resolve(__dirname, '..'));

var code = [];

function readFile (filename, name) {
  var c = fs.readFileSync(filename, 'utf8');
  return 'var module = {exports: {}};\n' +
         '(function (module, exports) {\n' +
          c + '\n' +
          '})(module, module.exports)\n' +
          'modules["' + name + '"] = module.exports;\n';
}

function fn2code (fn) {
  var lines = fn.toString().split(/\r?\n/).map(function (item) {
    return item.trimRight();
  });
  lines.shift();
  lines.pop();
  return lines.join('\n');
}

code.push(fn2code(function () {
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
}));
code.push(readFile('./lib/error.js', './error'));
code.push(readFile('./lib/flow.js', './flow'));
code.push(readFile('./lib/if.js', './if'));
code.push(readFile('./lib/for.js', './for'));
code.push(readFile('./lib/each.js', './each'));
code.push(readFile('./lib/series.js', './series'));
code.push(readFile('./lib/parallel.js', './parallel'));
code.push(readFile('./lib/index.js', './index'));
code.push(fn2code(function () {
  global.brightFlow = require('./index');
}));

code = ';(function (global) {\n' +
       code.join('\n') + '\n' +
       '})(window);';

fs.writeFileSync('./build/bright-flow.js', code);

fs.writeFileSync('./build/bright-flow.min.js', UglifyJS.minify('./build/bright-flow.js').code);