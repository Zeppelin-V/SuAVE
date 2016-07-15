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

exports.addCommentByParameters = function(file, user, para, comment, callback){
  parameters.findOne(para, function(e, o){
    if(o != null){
      comments.insert({"content": comment, "para_id": o._id,
      "date": new Date()}, function(e, out){
        if(e){
          callback(e);
        }else{
          callback(null);
        }
      });
    }else{
      parameters.insert(para, function(error, result){
        snapshots.insert({"file": file, "user": user,
        "para_id": result.insertedId, "date": new Date()});
        comments.insert({"content": comment, "para_id": para._id,
        "date": new Date()}, function(e, o){
          if(e){
            callback(e);
          }else{
            callback(null);
          }
        });
      });
    }
	});
};

exports.getCommentsByParameters = function(para, callback){
  parameters.findOne(para, function(e, o){
		if(e){
			callback(e, null);
		}else{
			//check if there exists such a paramter in the database
			if(o == null){
				callback(null, null);
			}else{
				comments.find({para_id: o._id}).toArray(function(error, result){
	        if(error){
						callback(error, null);
					}else if(result.length == 0){
						//check if there exists at least one comment in the database
						callback(null, null);
					}else{
						//found any
						callback(null, result);
					}
	      });
			}
		}
	});
};
