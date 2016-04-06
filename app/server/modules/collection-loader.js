var exports = module.exports;
var fs = require('fs'); //file system
var fsx = require('fs-extra');
var parse = require('csv-parse');
var json2csv = require('json2csv');
var spawn = require('child_process').spawn;
var sharp = require('sharp');

//load csv file by path
exports.loadCSV = function(filePath, callback){
  fs.readFile(filePath, 'utf-8', function (err, data) {
    if (err) {
      callback("err");
    } else {
      parse(data, function(err, output){
        callback(output);
      });
    }
  });
};

exports.getSurveyColumnAndCollect = function(name, user, callback){
  var filePath = __dirname + "/../../public/surveys/"+user+"_"+name+".csv";
  fs.readFile(filePath, 'utf-8', function (err, data) {
    if (err) {
      callback("Unable to read survey info", null);
    } else {
      parse(data, function(err, output){
        if(err){
          callback(err, null);
        }else{
          var result = output[0];
          for (var i = 0; i < result.length; i++) {
            if (result[i] == "#img") {
              result.splice(i, 1);
                  break;
              }
          }
          callback(null, result);
        }
      });
    }
  });
};

exports.getColumnsOptions = function(name, user, column, callback){
  var filePath = __dirname + "/../../public/surveys/"+user+"_"+name+".csv";
  fs.readFile(filePath, 'utf-8', function (err, data) {
    if (err) {
      callback("Unable to read survey info", null);
    } else {
      parse(data, function(err, output){
        if(err){
          callback(err, null);
        }else{
          var name = output[0];
          var colIndex = -1;
          for (var i = 0; i < name.length; i++) {
            if (name[i] == column) {
              colIndex = -1;
            }
          }
          var hash = {};
          for (var i = 0; i < output.length; i++) {
            var tmp = output[i][colIndex];
            if(tmp != undefined){
              hash[tmp] = tmp;
            }
          }
          var result = [];
          for(var key in hash){
            result.push(key);
          }
          callback(null, result);
        }
      });
    }
  });
};

//generate deep zoom files including .dzc and .dzi
exports.generateDeepZoom = function(dir, collection, destination, callback){
  var fs = require('fs');
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  if(collection == "default"){
    fs.readFile(__dirname+"/../../public/img/default.jpg", function(err, data){
      var newPath = dir + "/default.jpg";

      fs.writeFile(newPath, data, function(err){
        if(err){
          callback(err);
        }else{
          var sources = [];
          var maxLevel = 0;
          sources.push("default.jpg");
          var xml = "";
          //generate dzi
          for(var i = 0; i < sources.length; i++){
            var source = sources[i];
            var id = source.substr(0, source.lastIndexOf('.'));
            var desFile = dir+'/'+ id +'.dzi';
            if(fs.existsSync(desFile)){
              fsx.remove(desFile, function(e){
                if(e) callback(e);
              });
            }
            sharp(dir+ '/' + source).tile(256).toFile(desFile,
              function(error, info){
                if(error){
                  callback(error);
                }
            });
            xml = xml + '<I N="'+0+'" Id="'+id+'" Source="'+id+'.dzi"><Size Width='
              +'"300" Height="300"/></I>';
          }
          //generate dzc
          xml = '<?xml version="1.0" encoding="utf-8"?><Collection MaxLevel="'+
            +maxLevel+'" TileSize="256" Format="jpg"><Items>'+xml+'</Items></Collection>';

          fs.writeFile(dir + "/" + destination, xml, function(e){
            if(e){
              callback(e);
            }
          });
        }
      });
    });
  }else{
    //TODO: copy other collection images
  }
};

//set #img column for csv files
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
      //if #img column already exists
      for(var i = 1; i < data.length; i++){
        data[i][img_column] = "default";
      }
    }
    callback(data);

  }else{
    //TODO: set images for other collection
  }
};

//set csv csv files
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

//set the changed csv files
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
