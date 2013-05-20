[![Build Status](https://secure.travis-ci.org/leizongmin/bright-flow.png?branch=master)](http://travis-ci.org/leizongmin/bright-flow)

bright-flow
===========

JavaScript异步流程控制库

安装
========

```bash
npm install bright-flow
```


使用
========

### 条件判断

```
var _ = require('bright-flow');

_.if(1 + 1 === 2).then(function (done) {
  console.log('do something...');
  done();
}).end(function (err) {
  if (err) throw err;
  console.log('done.');
});

_.if(1 > 2).then(function (done) {
  console.log('it is wrong!');
  done();
}).else(function (done) {
  console.log('do something...');
  done();
}).end(function (err) {
  if (err) throw err;
  console.log('done.');
});

_.if(1 > 2).then(function (done) {
  console.log('it is wrong!');
  done();
}).elseif(2 > 3).then(function (done) {
  console.log('it is wrong!');
  done();
}).elseif(2 > 4).then(function (done) {
  console.log('it is wrong!');
  done();
}).else(function (done) {
  console.log('do something...');
  done();
}).end(function (err) {
  if (err) throw err;
  console.log('done.');
});
```

说明：条件可以为函数，比如： `_.if(function () { return true; })` 或者是异步回调的函数：

```
_.if(function (callback) {
  callback(true);
}).then(function (done) {
  console.log('do something...');
  done();
}).end(function (err) {
  if (err) throw err;
  console.log('done.');
});
```

### 条件循环

```
var _ = require('bright-flow');

var i = 0;
_.for(function () {
  return i < 10;
}).do(function (done) {
  setTimeout(function () {
    console.log('i=%d', i);
    i++;
    done();
  }, 500);
}).end(function (err) {
  if (err) throw err;
  console.log('done.');
});
```

说明：条件可以为异步回调方式，如： `_.for(function (callback) { callback(true); })`

### 遍历数组或对象

```
var _ = require('bright-flow');

_.each([123, 234, 345, 456, 567]).do(function (item, index, list, done) {
  setTimeout(function () {
    console.log('index=%d, value=%s', index, item);
    done();
  }, 500);
}).end(function (err) {
  if (err) throw err;
  console.log('done.');
});

_.each({a: 123, b: 456, c: 789, d: 910}).do(function (item, key, list, done) {
  setTimeout(function () {
    console.log('key=%s, value=%s', key, item);
    done();
  }, 500);
}).end(function (err) {
  if (err) throw err;
  console.log('done.');
});
```

### 顺序执行

```
var _ = require('bright-flow');

_.series().do(function (done) {
  setTimeout(function () {
    console.log('one');
    done();
  }, 500);
}).do(function (done) {
  setTimeout(function () {
    console.log('two');
    done();
  }, 500);
}).do(function (done) {
  setTimeout(function () {
    console.log('tree');
    done();
  }, 500);
}).end(function (err) {
  if (err) throw err;
  console.log('done.');
});
```

### 并发执行

```
var _ = require('bright-flow');

_.parallel().do(function (done) {
  setTimeout(function () {
    console.log('one');
    done();
  }, Math.random() * 1000);
}).do(function (done) {
  setTimeout(function () {
    console.log('two');
    done();
  }, Math.random() * 1000);
}).do(function (done) {
  setTimeout(function () {
    console.log('tree');
    done();
  }, Math.random() * 1000);
}).end(function (err) {
  if (err) throw err;
  console.log('done.');
});
```

### 出错处理

1、通过 `done(err)` 来返回出错信息，并中断异步执行：

```
var _ = require('bright-flow');

_.series().do(function (done) {
  done(new Error('Unknown error, just for test.'))
}).do(function (done) {
  console.log('here will not run');
}).end(function (err) {
  if (err) throw err;
  console.log('done.');
});
```

2、通过 `this.break()` 来中断异步执行：

```
var _ = require('bright-flow');

_.series().do(function (done) {
  this.break();
}).do(function (done) {
  console.log('here will not run');
}).end(function (err) {
  if (err) throw err;
  console.log('done.');
});
```

（注意：通过 `this.break()` 中断时，回调函数中会设置默认的err参数，若不想返回出错信息，
应使用 `this.break(null)` 来指定返回值）

### 超时处理

在执行 `.end()` 前，通过 `.timeout()` 来设置超时时间（单位为毫秒），若在指定时间
还没有处理完毕，则不等待异步任务结束而直接返回，并设置参数err

```
_.series().do(function (done) {
  // do nothing
}).timeout(1000).end(function (err) {
  if (err) throw err;
  console.log('done.');
});
```


授权
==========

基于 __MIT__ 协议发布

```
Copyright (c) 2012-2013 Lei Zongmin(雷宗民) <leizongmin@gmail.com>
http://ucdok.com

The MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```