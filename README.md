bright-flow
===========

JavaScript流程控制库


使用方法
========

```javascript
var _ = require('birght-flow');

// 条件判断
_.if(a > b).then(function () {
  console.log('a > b');
  this.done();
}).elseif(a < b).then(function () {
  console.log('a < b');
  this.done();
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
  if (i > 50) return this.break();
  i++;
  this.done();
}).end(function () {
  console.log('end for');
});

// 遍历
_.each([1,2,3,4,5]).do(function (v, i, arr) {
  console.log(v, i);
  this.done();
}).end(function () {
  console.log('end for each');
});

// 并行
_.parallel(function () {
  console.log('1');
  this.done();
}).do(function () {
  console.log('2');
  this.done();
}).do(function () {
  console.log('3');
  this.done();
}).timeout(1000).end(function () {
  console.log('end parallel task');
});

// 串行
_.series(function () {
  console.log('1');
  this.done();
}).do(function () {
  console.log('2');
  this.done();
}).do(function () {
  console.log('3');
  this.done();
}).timeout(1000).end(function () {
  console.log('end series task');
});

```