/**
 * 列出目录下的所有文件
 */

var path = require('path');
var fs = require('fs');
var _ = require('../');

// 要列出的目录
var dir = path.resolve(process.argv[2]);

// 输出文件名
// indent:字符串前缀，isLast:是否为该级目录的最后一个文件, str:文件名
var print = function (indent, isLast, str) {
  console.log(indent + (isLast ? '└─ ' : '├─ ') + str);
};

// 列出指定目录下的所有文件
// dir:要列出的目录 indent:输出时的字符串前缀, isLast:是否为该级目录的最后一个文件
// cb:回调函数，第一个参数为该目录及子目录下的文件数量
var tree = function (dir, indent, isLast, cb) {
  var indent = indent + (isLast ? '  ' : '│ ');

  // 读取本级目录下的所有文件名
  fs.readdir(dir, function (err, files) {
    if (err) {
      print(indent, isLast, err);
      cb();
    } else {

      var subTotalFile = 0;
      var lastIndex = files.length - 1;

      // 开始读取列出该级的所有文件
      _.each(files).do(function (name, i) {

        var me = this;
        var file = path.resolve(dir, name);
        var isLast = i >= lastIndex;

        // 取文件属性，如果是目录，则继续列出子目录
        fs.stat(file, function (err, stats) {
          if (err) {
            print(indent, isLast, err);
            me.done();
          } else {
            // 输出
            print(indent, isLast, name + (stats.isFile() ? ' [size:' + stats.size + ']' : ''));

            if (stats.isDirectory()) {
              tree(file, indent, isLast, function (total) {
                if (total > 0) subTotalFile += total;
                me.done();
              });
            } else {
              me.done();
            }
          }
        });
        
      }).end(function () {
        // 回调函数
        cb(files.length + subTotalFile);
      });
    }
  });
};


var timestamp = Date.now();
tree(dir, '', true, function (total) {
  console.log('\ntotal %d files, spent %dms', total, (Date.now() - timestamp));
});