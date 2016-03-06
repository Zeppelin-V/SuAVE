var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');
var fsx = require('fs-extra');
var fs = require('fs'); //file system
var path = require('path');

var dbPort 		= 27017;
var dbHost 		= 'localhost';
var dbName 		= 'suave';


/* establish the database connection */

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
	if (e) {
		console.log(e);
	}
});

var surveys = db.collection('surveys');

exports.createNewSurvey = function(files, user, callback){
  surveys.findOne({"name": files.body.name}, function(e, o){
		if (o){
      console.log(o);
			callback("Name is taken");
		}
    else{
      fs.readFile(files.file.path, function(err, data){
        var newPath = __dirname + "/../../public/surveys/"+user+"_"
          +files.body.name+".csv";
        fs.writeFile(newPath, data, function(err){
          if(err){
            callback(err);
          }else{
            surveys.insert({"name": files.body.name, "user": user,
            "csv": newPath, "hidden": 0}, callback);
          }
        });
      });
    }
	});
}


exports.delAllRecords = function(callback)
{
	var tmp = __dirname + "/../surveys/*";
  var files = __dirname + "/../../public/surveys/*";
  fsx.remove(tmp, function(err){
    if(err) return console.error(err);
  });
  fsx.remove(files, function(err){
    if(err) return console.error(err);
  });
	surveys.remove({}, callback); // reset accounts collection for testing //
}

exports.deleteSurvey = function(user, callback)
{
  var tmp = __dirname + "/../surveys/*";
  var file = __dirname + "/../../public/surveys/"+user+"_*";
  fsx.remove(tmp, function(err){
    if(err) return console.error(err);
  });
  fsx.remove(file, function(err){
    if(err) return console.error(err);
  });
	surveys.remove({"user": user}, callback);
}
