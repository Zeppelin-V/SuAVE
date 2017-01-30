
var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect(
{
	host 	    : process.env.EMAIL_HOST || 'smtp.gmail.com',
	user 	    : process.env.EMAIL_USER || 'spatialsuave@gmail.com',
	password    : process.env.EMAIL_PASS || '1spatial',
	ssl		    : true
});

EM.dispatchResetPasswordLink = function(account, callback)
{
	EM.server.send({
		from         : process.env.EMAIL_FROM || 'SuAVE <do-not-reply@gmail.com>',
		to           : account.email,
		subject      : 'Password Reset',
		text         : 'something went wrong... :(',
		attachment   : EM.composeEmail(account)
	}, callback );
}

EM.composeEmail = function(o)
{
	var link = 'http://suave.sdsc.edu:3000/reset-password?e='+o.email+'&p='+o.pass;
	var html = "<html><body>";
		html += "Hi "+o.name+",<br><br>";
		html += "Your username is <b>"+o.user+"</b><br><br>";
		html += "<a href='"+link+"'>Click here to reset your password</a><br><br>";
		html += "Cheers,<br><br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
}

EM.sendMessage = function(data, callback)
{
	var html = "<html><body>";
		html += "Hi,<br><br>";
		html += "<b>" + data.name + " (" + data.email +") says: </b><br><br>";
		html += "<p>" + data.message + "</p><br><br>";
		html += "Cheers<br><br>";
		html += "</body></html>";

		EM.server.send({
			from         : process.env.EMAIL_FROM || 'SuAVE <do-not-reply@gmail.com>',
			to           : data.user_email,
			subject      : 'Message from ' + data.name,
			text         : 'something went wrong... :(',
			attachment   : [{data:html, alternative:true}]
		}, callback );
}
