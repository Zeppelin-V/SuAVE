var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');
var fsx = require('fs-extra');
var fs = require('fs'); //file system
var path = require('path');
var loader = require('./collection-loader');
var GL = require('../global');

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
  surveys.findOne({"name": files.body.name, "user": user}, function(e, o){
		if (o){
      console.log(o);
			callback("Name is taken");
		}
    else{
      fs.readFile(files.file.path, function(err, data){
				if (!fs.existsSync(__dirname + "/../../public/surveys")){
			    fs.mkdirSync(__dirname + "/../../public/surveys");
			  }
				var name = files.body.name.replace(/ /g,"-");
        var newPath = __dirname + "/../../public/surveys/"+user+"_"
          +name+".csv";
        fs.writeFile(newPath, data, function(err){
          if(err){
            callback(err);
          }else{
            surveys.insert({"name": name, "user": user,
            "csv": newPath, "view": "grid", "views": 111000, "collection": "default",
						 "hidden": 0}, callback);
          }
        });

				var aboutPath = __dirname + "/../../public/surveys/"+user+"_"
          +name+"about.html"
					var aboutContent = GL.getAbout(1) + name + GL.getAbout(2) + GL.getAbout(3) + GL.getAbout(4);
				fs.writeFile(aboutPath, aboutContent, function(err){
          if(err){
            callback(err);
          }
        });
      });
    }
	});
}

exports.replaceSurvey = function(files, user, callback){
  surveys.findOne({"name": files.body.name, "user": user}, function(e, o){
		if (e){
			callback("Survey does not exist!");
		}
    else{
      fs.readFile(files.file.path, function(err, data){
				if (!fs.existsSync(__dirname + "/../../public/surveys")){
			    fs.mkdirSync(__dirname + "/../../public/surveys");
			  }
				var name = files.body.name.replace(/ /g,"-");
        var newPath = __dirname + "/../../public/surveys/"+user+"_"
          +name+".csv";
        fs.writeFile(newPath, data, function(err){
          if(err){
            callback(err);
          }else{
						callback(null, "ok");
          }
        });
      });
    }
	});
}

exports.changeCollection = function(files, user, collection, callback){
	var filePath = __dirname + "/../../public/surveys/"+user+"_"
		+files.body.name+".csv";

	//load csv data
	var data;
	loader.setCSV(filePath, collection, function(o){
		if(o == "err"){
			callback("Unable to read file");
		}else{
			data = o;
			loader.saveCSV(filePath, data, function(e){
				if(e){
					callback("Unable to save file");
				}else{
					callback(null);
				}
			});
		}
	});
}

exports.changeCollectionItemName = function(files, user, collection, callback){
	var filePath = __dirname + "/../../public/surveys/"+user+"_"
		+files.body.name+".csv";

	//load csv data
	var data;
	loader.setCSViName(filePath, files.body.iName, function(o){
		if(o == "err"){
			callback("Unable to read file");
		}else{
			data = o;
			loader.saveCSV(filePath, data, function(e){
				if(e){
					callback("Unable to save file")
				}else{
					callback(null);
				}
			});
		}
	});
}

exports.getSurveyByUsername = function(username, callback)
{
	surveys.find({user: username}).toArray(function(e, o){
		callback(null, o);
	});
}

exports.getPublicSurveyByUsername = function(username, callback)
{
	surveys.find({user: username, "hidden": 0}).toArray(function(e, o){
		callback(null, o);
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
	surveys.remove({}, callback);
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

exports.deleteSurveyByName = function(filename, user, callback)
{
  var tmp = __dirname + "/../surveys/*";
  var file = __dirname + "/../../public/surveys/"+user+"_"+filename+"*";
  fsx.remove(tmp, function(err){
    if(err) return console.error(err);
  });
  fsx.remove(file, function(err){
    if(err) return console.error(err);
  });
	surveys.remove({"name": filename, "user": user}, callback);
}


exports.hideSurveyByNameID = function(filename, user, callback)
{
	surveys.findOne({"name":filename, "user": user}, function(e, o){
		if (e){
			callback(e);
		}	else{
			if(o.hidden == 1) o.hidden = 0;
			else o.hidden = 1;
			surveys.save(o, callback);
		}
	});
}

exports.changeViewByNameID = function(filename, user, view, callback)
{
	surveys.findOne({"name":filename, "user": user}, function(e, o){
		if (e){
			callback(e);
		}	else{
			o.view = view;
			surveys.save(o, callback);
		}
	});
}

exports.changeViewOptionsByNameID = function(filename, user, views, callback)
{
	surveys.findOne({"name":filename, "user": user}, function(e, o){
		if (e){
			callback(e);
		}	else{
			o.views = views;
			surveys.save(o, callback);
		}
	});
}
