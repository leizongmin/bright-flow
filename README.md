[![Build Status](https://secure.travis-ci.org/leizongmin/bright-flow.png?branch=master)](http://travis-ci.org/leizongmin/bright-flow)

bright-flow
===========

JavaScript异步流程控制库

安装
========

```bash
npm install bright-flow
```

使用方法
========

```javascript
var _ = require('birght-flow');

// 条件判断
_.if(a > b).then(function () {
  console.log('a > b');
  // 执行this.done()表示已处理完毕
  this.done();
}).elseif(a < b).then(function () {
  var me = this;
  console.log('a < b');
  setTimeout(function () {
    me.done();
  }, 1000);
}).else(function () {
  console.log('wrong');
  this.done();
}).end(function () {
  console.log('end if');
});

// 循环
var i = 0;
_.for(function () {
  return i < 100;
}).do(function () {
  console.log(i);
  // 执行this.break()提前结束循环
  if (i > 50) return this.break();
  i++;
  // 执行this.done()表示本次循环已处理完毕
  this.done();
}).end(function () {
  console.log('end for');
});

// 遍历
_.each([1,2,3,4,5]).do(function (v, i, arr) {
  console.log(v, i);
  // 也具有 this.done() 和 this.break()
  this.done();
}).end(function () {
  console.log('end for each');
});

// 并行
_.parallel().do(function () {
  console.log('1');
  // 也具有 this.done() 和 this.break()
  this.done();
}).do(function () {
  console.log('2');
  this.done();
}).do(function () {
  console.log('3');
  this.done();
}).timeout(1000).end(function () {
  // timeout()用于设置超时时间，当省略时表示不限制时间
  // timeout()必须在end()之前
  console.log('end parallel task');
});

// 串行
_.series().do(function () {
  console.log('1');
  // 也具有 this.done() 和 this.break()
  this.done();
}).do(function () {
  console.log('2');
  this.done();
}).do(function () {
  console.log('3');
  this.done();
}).timeout(1000).end(function () {
  // timeout()用于设置超时时间，当省略时表示不限制时间
  // timeout()必须在end()之前
  console.log('end series task');
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