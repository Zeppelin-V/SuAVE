var exports = module.exports;
var fs = require('fs'); //file system
var parse = require('csv-parse');

exports.loadCSV = function(filePath, callback){
  fs.readFile(filePath, 'utf-8', function (err, data) {
    if (err) {
      callback("Unable to read file");
    } else {
      parse(data, function(err, output){
        callback(output);
      });
    }
  });
};
