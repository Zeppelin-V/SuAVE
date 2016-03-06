var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');
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

/*
exports.addNewAccount = function(newData, callback)
{
	accounts.findOne({user:newData.user}, function(e, o) {
		if (o){
			callback('username-taken');
		}	else{
			accounts.findOne({email:newData.email}, function(e, o) {
				if (o){
					callback('email-taken');
				}	else{
					saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
					// append date stamp when record was created //
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						fs.copySync(path.resolve(__dirname+'/..', 'views/layout.jade'),
								'./app/server/gallery/'+newData.user+'.jade');
						accounts.insert(newData, {safe: true}, callback);
					});
				}
			});
		}
	});
}*/

exports.createNewSurvey = function(files, user, callback){
  fs.readFile(files.file.path, function(err, data){
    var newPath = __dirname + "/../surveys/"+user+"_"+files.name;
    fs.writeFile(newPath, data, function(err){
      if(err){
        callback(err);
      }else{
        surveys.insert({"name": files.name, "user": user,
        "csv": newPath, "hidden": 0}, callback);
      }
    });
  });
}
