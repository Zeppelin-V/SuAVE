var exports = module.exports;
var fs = require('fs'); //file system
var fsx = require('fs-extra');
var parse = require('csv-parse');
var json2csv = require('json2csv');
var spawn = require('child_process').spawn;
var GL = require('../global');
//var sharp = require('sharp');


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

exports.changeAboutFileByID = function(user, name, fullname, data, callback){
  var filePath = __dirname + "/../../public/surveys/"+user+"_"+name+"about.html";
  var newData = GL.getAbout(1) + fullname + GL.getAbout(2) + GL.getAbout(3) + data +GL.getAbout(5);

  fs.writeFile(filePath, newData, function(err) {
    if (err) {
      callback(err);
    }else{
      callback(null);
      console.log("successfully rewrote about file");
    }
  });
}

exports.getAboutFileByID = function(user, name, callback){
  var filePath = __dirname + "/../../public/surveys/"+user+"_"+name+"about.html";
  fs.readFile(filePath, 'utf-8', function (err, data) {
    if (err) {
      callback("Unable to read survey info", null);
    } else {
      var startIndex = data.indexOf(GL.getAbout(3))+GL.getAbout(3).length;
      var endIndex = data.indexOf(GL.getAbout(5));
      callback(null, data.substring(startIndex, endIndex));
    }
  });
}

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
              colIndex = i;
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
            if(key != column) result.push(key);
          }
          callback(null, result);
        }
      });
    }
  });
};


/*DEPRECATED*/

/*
//generate deep zoom files including .dzc and .dzi
exports.generateDeepZoom = function(dir, collection, destination, callback){

  var fs = require('fs');
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  var xml = "";
  var maxLevel = 8;
  var sources = [];

  if(collection['name'] == "default"){
    sources.push("default.jpg");
  }else{
    for(var key in collection.values) {
      sources.push(collection.values[key] + ".jpg");
    }
  }

  //generate dzi
  for(var i = 0; i < sources.length; i++){
    var source = sources[i];
    var id = source.substr(0, source.lastIndexOf('.'));
    var desFile = dir+'/'+ id +'.dzi';
    xml = xml + '<I N="'+i+'" Id="'+id+'" Source="'+id+'.dzi"><Size Width='
      +'"300" Height="300"/></I>';
    if(fs.existsSync(desFile)){
      continue;
    }

    sharp(__dirname+"/../../public/img/"+collection.name+"/"+source).tile(256).toFile(desFile,
      function(error, info){
        if(error){
          callback(error);
        }
    });
  }

  //generate dzc
  xml = '<?xml version="1.0" encoding="utf-8"?><Collection MaxLevel="'
    +maxLevel+'" TileSize="256" Format="jpg"><Items>'+xml+'</Items></Collection>';

  fs.writeFile(dir + "/" + destination, xml, function(e){
    if(e){
      callback(e);
    }
  });
};*/

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

  if(collection.name == "default"){
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
    //var valCol = collection['column'];
    var shapeCol = collection['sColumn'];
    var colorCol = collection['cColumn'];
    var color;
    var shape;

    if(img_column == -1){
      data[0].push("#img");
      for(var i = 1; i < data.length; i++){
        if (shapeCol != '|^') shape = data[i][shapeCol].toLowerCase();
        if (colorCol != '|^') color = data[i][colorCol].toLowerCase();

        if(color == ''){
          color = '|^';
        }
        if(shape == ''){
          shape = '|^';
        }
        if(colorCol == '|^' || collection.cValues[color] == ''){
          if(shapeCol == '|^' || collection.sValues[shape] == ''){
            data[i].push("default");
          }else{
            data[i].push(collection.sValues[shape]);
          }
        }else{
          if(collection.sValues[shape] == ''){
            data[i].push(collection.cValues[color]);
          }else{
            data[i].push(collection.cValues[color]+'_'+collection.sValues[shape]);
          }
        }
      }
    }else{
      //if #img column already exists
      for(var i = 1; i < data.length; i++){
        if (shapeCol != '|^') shape = data[i][shapeCol].toLowerCase();
        if (colorCol != '|^') color = data[i][colorCol].toLowerCase();

        if(color == ''){
          color = '|^';
        }
        if(shape == ''){
          shape = '|^';
        }

        if(colorCol == '|^' || collection.cValues[color] == ''){
          if(shapeCol == '|^' || collection.sValues[shape] == ''){
            data[i][img_column] = "default";
          }else{
            data[i][img_column] = collection.sValues[shape];
          }
        }else{
          if(shapeCol == '|^' || collection.sValues[shape] == ''){
            data[i][img_column] = collection.cValues[color];
          }else{
            data[i][img_column] = collection.cValues[color]+'_'+collection.sValues[shape];
          }
        }
      }
    }
    callback(data);
  }
};

//set csv files
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

//set csv files
exports.setCSViName = function(filePath, iName, callback){
  var that = this;
  that.loadCSV(filePath, function(o){
    if(o == "err"){
      callback("err");
    }else{
      var data = o;

      var that = this;
      var categories = data[0];
      var name_column = -1;
      //get the index of name column
      for (var i = 0; i < categories.length; i++) {
          if (categories[i] == "#name") {
              name_column = i;
              break;
          }
      }

      var src_column = iName.name;
      if(name_column == -1){
        data[0].push("#name");
        for(var i = 1; i < data.length; i++){
          data[i].push(data[i][src_column]);
        }
      }else{
        for(var i = 1; i < data.length; i++){
          data[i][name_column] = data[i][src_column];
        }
      }


      var href_column = -1;
      //get the index of href column
      for (var i = 0; i < categories.length; i++) {
          if (categories[i] == "#href") {
              href_column = i;
              break;
          }
      }

      src_column = iName.href;
      if(href_column == -1){
        data[0].push("#href");
        for(var i = 1; i < data.length; i++){
          data[i].push(data[i][src_column]);
        }
      }else{
        for(var i = 1; i < data.length; i++){
          data[i][href_column] = data[i][src_column];
        }
      }



      callback(data);
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
      }else{
        callback(null);
      }
    });
  });
};


exports.getColumnsAndTags = function(user, name, callback){
  var filePath = __dirname + "/../../public/surveys/"+user+"_"+name+".csv";
  fs.readFile(filePath, 'utf-8', function (err, data) {
    if (err) {
      callback("Unable to read survey info", null);
    } else {


      parse(data, function(err, output){
        if(err){
          callback(err, null);
        }else{
          var names = output[0];
          var result = {"tags":[], "columns":[]};

          for(var i = 0; i < names.length; i++){
            if(names[i].indexOf('#') > -1){
              var tmp = {};
              tmp.values = [];

              if(names[i].indexOf('#number') > -1){
                tmp.values.push('#number');
                names[i] = names[i].replace('#number', '');
              }
              if(names[i].indexOf('#date') > -1){
                tmp.values.push('#date');
                names[i] = names[i].replace('#date', '');
              }
              if(names[i].indexOf('#long') > -1){
                tmp.values.push('#long');
                names[i] = names[i].replace('#long', '');
              }
              if(names[i].indexOf('#link') > -1){
                tmp.values.push('#link');
                names[i] = names[i].replace('#link', '');
              }
              if(names[i].indexOf('#ordinal') > -1){
                tmp.values.push('#ordinal');
                names[i] = names[i].replace('#ordinal', '');
              }
              if(names[i].indexOf('#textlocation') > -1){
                tmp.values.push('#textlocation');
                names[i] = names[i].replace('#textlocation', '');
              }
              if(names[i].indexOf('#hidden') > -1){
                tmp.values.push('#hidden');
                names[i] = names[i].replace('#hidden', '');
              }
              if(names[i].indexOf('#href') > -1){
                tmp.values.push('#href');
                names[i] = names[i].replace('#href', '');
              }

              if(tmp.values.length > 0){
                tmp.name = names[i];
                result.tags.push(tmp);
              }
            }

            result.columns.push(names[i]);

            /*
            if(names[i] != '#img' && names[i] != '#name'){
              result.columns.push(names[i]);
            }*/
          }

          callback(null, result);
        }
      });


    }
  });
};

exports.changeTagsForSurvey = function(user, name, columns, callback){
  var filePath = __dirname + "/../../public/surveys/"+user+"_"+name+".csv";
  var that = this;

  that.loadCSV(filePath, function(o){
    if(o == "err"){
      callback("err", null);
    }else{
      o[0] = columns;
      that.saveCSV(filePath, o, function(e){
        if(e){
          callback(e, null);
        }else{
          callback(null, "Successfully changed tags!");
        }
      })
    }
  });

};
