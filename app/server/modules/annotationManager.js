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

var surveys = db.collection('surveys_test');
var snapshots = db.collection('snapshots_test');
var comments = db.collection('comments_test');
var parameters = db.collection('parameters_test');

exports.addCommentByFileParameters = function(file, user, para, comment, callback){
  parameters.findOne(para, function(e, o){
    if(o){
      comments.insert({"content": comment, "para_id": o._id,
      "date": new Date()}, function(e, o){
        if(e){
          callback(e);
        }else{
          callback(null);
        }
      });
    }else{
      parameters.insert(para, function(error, result){
        //TODO: generate the screenshot, and the url
        if (!fs.existsSync(__dirname + "/../../public/screenshots")){
			    fs.mkdirSync(__dirname + "/../../public/screenshots");
			  }

				var name = file.replace(/ /g,"-");
        var picPath = __dirname + "/../../public/screenshots/"+user+"_"
          +name+"_"+result.insertedId+".png";
        snapshots.insert({"file": file, "user": user, "screenshot":picPath,
        "para_id": result.insertedId, "date": new Date()});
        comments.insert({"content": comment, "para_id": result.insertedId,
        "date": new Date()}, function(e, o){
          if(e){
            callback(e);
          }else{
            callback(null);
          }
        });
      });
    }
};

exports.getCommentByFileParameters = function(file, user, para, callback){
  parameters.findOne(para, function(e, o){
    if(o){
      comments.find({para_id: o.selected_id}).toArray(function(e, o){
        callback(o);
      });
    }else{
      callback(null);
    }
};
