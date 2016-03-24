var exports = module.exports;
var fs = require('fs'); //file system
var parse = require('csv-parse');
var json2csv = require('json2csv');
var execPhp = require('exec-php');

exports.loadCSV = function(filePath, callback){
  fs.readFile(filePath, 'utf-8', function (err, data) {
    if (err) {
      callback("err");
    } else {
      parse(data, function(err, output){
        //console.log(output);
        callback(output);
      });
    }
  });
};

exports.generateDeepZoom = function(dir, collection, destination, callback){
  var fs = require('fs');
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  if(collection == "default"){
    fs.readFile(__dirname+"/../../public/img/default.jpeg", function(err, data){
      var newPath = dir + "/default.jpeg";
      fs.writeFile(newPath, data, function(err){
        if(err){
          callback(err);
        }else{
          var sources = [];
          sources.push("default.jpeg");

          //implement deepzoom script
          execPhp("./Deepzoom/CreateNew.php", function(error, php, outprint){
            console.log(error);
            php.createDeepZoom(dir, sources, destination);
          });

        }
      });
    });
  }else{
    //TODO: copy other collection images
  }
};

exports.setImgProperty = function(data, collection, callback){
  var that = this;
  var categories = data[0];
  var img_column = -1;
  //get the index of image column
  for (var i = 0; i < categories.length; i++) {
      if (categories[i] == "#img") {
          img_column = i;
          break;
      }
  }

  if(collection == "default"){
    //if there is no column named #img
    if(img_column == -1){
      data[0].push("#img");
      for(var i = 1; i < data.length; i++){
        data[i].push("default");
      }
    }else{
      //if img column already exists
      for(var i = 1; i < data.length; i++){
        data[i][img_column] = "default";
      }
    }
    callback(data);

  }else{
    //TODO: set images for other collection
  }
};

exports.setCSV = function(filePath, collection, callback){
  var that = this;
  that.loadCSV(filePath, function(o){
    if(o == "err"){
      callback("err");
    }else{
      var data = o;
      that.setImgProperty(data, collection, function(e){
        callback(e);
      });
    }
  });
};

exports.saveCSV = function(filePath, data, callback){
  var csv = [];
  var fields = data[0];

  //jsonify array of data
  for(var i = 1; i < data.length; i++){
    var temp = {};
    for(var j = 0; j < data[0].length; j++){
      temp[data[0][j]] = data[i][j];
    }
    csv.push(temp);
  }

  //write to file by json2csv module
  json2csv({ data: csv, fields: fields }, function(err, csv) {
    if (err) callback(err);
    fs.writeFile(filePath, csv, function(err) {
      if (err) {
        callback(err);
      }
    });
  });
};
