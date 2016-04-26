var GL = require('./global');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var SM = require('./modules/survey-manager');
var CL = require('./modules/collection-loader');
var multer  = require('multer');

module.exports = function(app) {
	var uploading = multer({
	  dest: __dirname + '/surveys/',
	  limits: {fileSize: 100000000, files:1},
	});

// main login page //
	app.get('/', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					res.redirect('/home');
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});

	app.post('/', function(req, res){
		AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			}	else{
				req.session.user = o;
				if (req.body['remember-me'] == 'true'){
					res.cookie('user', o.user, { maxAge: 90000000 });
					res.cookie('pass', o.pass, { maxAge: 90000000 });
				}
				res.status(200).send(o);
			}
		});
	});

// logged-in user homepage //

	app.get('/home', function(req, res) {
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
			res.render('home', {
				title : 'Gallery',
				udata : JSON.stringify(req.session.user.user)}
			);
		}
	});

	app.get('/update', function(req, res) {

		if (req.session.user == null){
			res.redirect('/');
		}	else{
			res.render('update', {
				title : 'Account Setting',
				udata : req.session.user}
			);
		}
	});

	app.post('/update', function(req, res){
		if (req.session.user == null){
			res.redirect('/');
		}	else{
			AM.updateAccount({
				id		: req.session.user._id,
				name	: req.body['name'],
				email	: req.body['email'],
				pass	: req.body['pass']
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });
					}
					res.status(200).send('ok');
				}
			});
		}
	});

	app.post('/logout', function(req, res){
		res.clearCookie('user');
		res.clearCookie('pass');
		req.session.destroy(function(e){ res.status(200).send('ok'); });
	})

// creating new accounts //

	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup'});
	});

	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.body['name'],
			email 	: req.body['email'],
			user 	: req.body['user'],
			pass	: req.body['pass']
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.body['email'], function(o){
			if (o){
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// TODO add an ajax loader to give user feedback //
					if (!e){
						res.status(200).send('ok');
					}	else{
						for (k in e) console.log('ERROR : ', k, e[k]);
						res.status(400).send('unable to dispatch password reset');
					}
				});
			}	else{
				res.status(400).send('email-not-found');
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});

	app.post('/reset-password', function(req, res) {
		var nPass = req.body['pass'];
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('unable to update password');
			}
		})
	});

// view & delete accounts //

	app.get('/accounts', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('accounts', { title : 'Account List', accts : accounts });
		})
	});

	app.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				SM.deleteSurvey(req.session.user.user, function(e, obj){
					if(e) res.status(400).send('record not found');
				});
				res.clearCookie('user');
				res.clearCookie('pass');
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
				res.status(400).send('record not found');
			}
	    });
	});

	app.get('/reset-hg7234h', function(req, res) {
		SM.delAllRecords(function(){
			AM.delAllRecords(function(){
				res.redirect('/accounts');
			});
		});
	});

// individual galleries

	app.get('/gallery/:user', function(req, res){
		AM.getAccountByUsername(req.params.user, function(o){
			if(o){
				res.render('../gallery/'+req.params.user);
			}else{
				res.render('404', { title: 'Page Not Found'});
			}
		});
	});

//new survey
	app.post('/uploadCSV', uploading.single('file'), function(req, res){
		SM.createNewSurvey(req, req.cookies.user, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
				//Set the default collection for new survey
				var defaultCol = 1;
				SM.changeCollection(req, req.cookies.user, {"name": "default"},
					function(e){
					if(e){
						res.status(400).send(e);
					}else{
						res.status(200).send('ok');
					}
				});
			}
		});
	});

//changeCollection
	app.post('/changeCollection', function(req, res){
		SM.changeCollection(req, req.cookies.user, req.body.collection,
			function(e){
			if(e){
				res.status(400).send(e);
			}else{
				res.status(200).send('ok');
			}
		});
	});

//get survey's column name
	app.post('/getSurveyColumnsNCollection', function(req, res){
		CL.getSurveyColumnAndCollect(req.body.name, req.body.user, function(e, o){
			if(e){
				res.status(400).send(e);
			}else{
				res.status(200).send(o);
			}
		});
	});

	//get survey's column name
		app.post('/getColumnsOptions', function(req, res){
			CL.getColumnsOptions(req.body.name, req.body.user,
				req.body.column, function(e, o){
				if(e){
					res.status(400).send(e);
				}else{
					res.status(200).send(o);
				}
			});
		});

//get and delete surveys
	app.post('/getSurveys', function(req, res) {
		SM.getSurveyByUsername(req.body.user, function(e, surveys){
			if(e) {
				res.status(400).send(e);
			}else{
				res.status(200).send(surveys);
			}
		})
	});

	app.post('/getPublicSurveys', function(req, res) {
		SM.getPublicSurveyByUsername(req.body.user, function(e, surveys){
			if(e) {
				res.status(400).send(e);
			}else{
				res.status(200).send(surveys);
			}
		})
	});

	app.post('/deleteSurvey', function(req, res) {
		SM.deleteSurveyByName(req.body.name, req.body.user, function(e){
			if(e) {
				res.status(400).send(e);
			}else{
				res.status(200).send("ok");
			}
		})
	});

	app.post('/hideSurveyByNameID', function(req, res) {
		SM.hideSurveyByNameID(req.body.name, req.body.user, function(e){
			if(e) {
				res.status(400).send(e);
			}else{
				res.status(200).send("ok");
			}
		})
	});

	app.post('/changeViewByNameID', function(req, res) {
		SM.changeViewByNameID(req.body.name, req.body.user, req.body.view, function(e){
			if(e) {
				res.status(400).send(e);
			}else{
				res.status(200).send("ok");
			}
		})
	});

	app.post('/changeViewOptions', function(req, res) {
		SM.changeViewOptionsByNameID(req.body.name, req.body.user, req.body.views, function(e){
			if(e) {
				res.status(400).send(e);
			}else{
				res.status(200).send("ok");
			}
		})
	});


	app.get('/getSurveys/:survey', function(req, res){
		console.log(__dirname + '/surveys/');
		res.sendFile(req.params.survey, {root: __dirname + '/../public/surveys/'});
	});


	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};
