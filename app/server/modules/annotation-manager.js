var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var ObjectId = require('mongodb').ObjectID;
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

exports.getParaById = function(id, callback){
	var newId = new ObjectId(id);

	parameters.findOne({_id: newId}, function(e, o){
		if(e){
			callback(error, null);
		}else{
			callback(null, o);
		}
	});
};

exports.getSnapshotById = function(id, callback){
	var newId = new ObjectId(id);

	snapshots.findOne({para_id: newId}, function(e, o){
		if(e){
			callback(error, null);
		}else{
			callback(null, o);
		}
	});
};


exports.getParaIdByParamters = function(file, user, para, graphPara, callback){
	parameters.findOne(para, function(e, o){
		if(e){
			callback(e, null);
		}
		if(o != null){
      callback(null, o._id);
    }else{
			parameters.insert(para, function(e, o){
				if(e){
					callback(e, null);
				} else{
					var snapshot = {"file": file, "user": user,
	        "para_id": para._id, "graph_para": graphPara, "date": new Date()};
	        snapshots.insert(snapshot, function(error, result){
						if(error){
		          callback(error, null);
		        }else{
							/*
							snapshots.find({"para_id": para._id}).toArray(function(e, o){
								if(e){
									callback(error);
								}

								if(o == null){
									callback("error");
								}else{
									callback(null);
								}
							});*/

		          callback(null, para._id);
		        }
					});
				}
      });
		}
	});
};

exports.addCommentByParameters = function(file, user, para, graphPara, comment, replyUser, callback){
  parameters.findOne(para, function(e, o){
    if(o != null){
      comments.insert({"user": replyUser, "content": comment, "para_id": o._id,
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
        "para_id": para._id, "graph_para": graphPara, "date": new Date()});
        comments.insert({"user": replyUser, "content": comment, "para_id": para._id,
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

exports.getCommentsById = function(id, callback){
	var newId = new ObjectId(id);
	comments.find({para_id: newId}).toArray(function(error, result){
    if(error){
			callback(error, null);
		}else{
			//found any
			callback(null, result);
		}
  });

};

exports.addCommentById = function(id, user, comment, callback){
	var newId = new ObjectId(id);

	comments.insert({"content": comment, "user": user, "para_id": newId,
	"date": new Date()}, function(e, o){
		if(e){
			callback(e);
		}else{
			comments.find({para_id: newId}).toArray(function(error, result){
		    if(error){
					callback(error, null);
				}else{
					//found any
					callback(null, result);
				}
		  });
		}
	});

};
