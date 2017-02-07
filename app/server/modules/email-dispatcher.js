var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    user: process.env.EMAIL_USER || 'spatialsuave@gmail.com',
    password: process.env.EMAIL_PASS || '1spatial',
    ssl: true
});

EM.dispatchResetPasswordLink = function(account, callback) {
    EM.server.send({
        from: process.env.EMAIL_FROM || 'SuAVE <do-not-reply@gmail.com>',
        to: account.email,
        subject: 'Password Reset',
        text: 'something went wrong... :(',
        attachment: EM.composeEmail(account)
    }, callback);
}

EM.composeEmail = function(o) {
    var link = 'http://suave.sdsc.edu:3000/reset-password?e=' + o.email + '&p=' + o.pass;
    var html = "<html><body>";
    html += "Hi " + o.name + ",<br><br>";
    html += "Your username is <b>" + o.user + "</b><br><br>";
    html += "<a href='" + link + "'>Click here to reset your password</a><br><br>";
    html += "Cheers,<br><br>";
    html += "</body></html>";
    return [{
        data: html,
        alternative: true
    }];
}

EM.sendMessage = function(data, callback) {
    var html = "<html><body>";
    html += "Hi,<br><br>";
    html += "<b>" + data.name + " (" + data.email + ") says: </b><br><br>";
    html += "<p>" + data.message + "</p><br><br>";
    html += "Cheers<br><br>";
    html += "</body></html>";

    EM.server.send({
        from: process.env.EMAIL_FROM || 'SuAVE <do-not-reply@gmail.com>',
        to: data.user_email,
        subject: 'Message from ' + data.name,
        text: 'something went wrong... :(',
        attachment: [{
            data: html,
            alternative: true
        }]
    }, callback);
}

EM.sendWelcomeMessage = function(data, callback) {
    var message =
        '<html><body>' +
        '<p>Dear ' + data.name + ',</p>'　 +
        '<p>Thank you for creating a SuAVE account. Here are some resources to help you get started:</p>' +
        '<p>1) Publishing your datasets in SuAVE is straightforward. Once you log in, click &ldquo;New Survey,&rdquo; enter a survey title and point to a CSV file with the data. You can also customize the look and feel of the survey and add survey metadata &ndash; see a step-by-step guide at <a href="http://suave.sdsc.edu/tutorials/">http://suave.sdsc.edu/tutorials/</a></p>' +
        '<p>2) There is a large number of SuAVE applications under http://suave.sdsc.edu/gallery/ and http://suave.sdsc.edu/news/. Click &ldquo;About Survey&rdquo; on any application to learn more.</p>' +
        '<p>3) You can illustrate your research with pointers to saved SuAVE views, using &ldquo;Comment&rdquo; and &ldquo;Share&rdquo; functions. As a result, readers will be able to reproduce your analysis, opening SuAVE at annotation points and tracing your steps, or take analysis in other directions. See an example at <a href="http://suave.sdsc.edu/blog/">http://suave.sdsc.edu/blog/</a></p>' +
        '<p>Please don&rsquo;t hesitate to email us with any questions about SuAVE. We&rsquo;ll be happy to help. SuAVE project news, including a pointer to the recent EoE webinar which attracted 329 registrants from 77 countries, are at http://suave.sdsc.edu/news. We are finishing bug fixes and browser-specific tests on the development system (suave-dev.sdsc.edu, or suave.sdsc.edu:3001: several users have established accounts there as well), and plan to update the current system with new functions in the next few weeks. The update will include better publishing and annotation functionality, optimized rendering, dynamic text overlays and tooltips, and many more functions requested by users.</p>' +
        '<p>Your feedback and suggestions are always welcome.</p>' +
        '<p>Thank you,</p>' +
        '<p>- Ilya Zaslavsky, on behalf of the SuAVE team</p>' +
        '</body></html>';

		var html = "<html><body>";
		html += "Hi,<br><br>";
		html += "<b>" + data.name + " (" + data.email + ") has been created </b><br><br>";
		html += "Cheers<br><br>";
		html += "</body></html>";

    EM.server.send({
        from: process.env.EMAIL_FROM || 'SuAVE <do-not-reply@gmail.com>',
        to: 'lisided@gmail.com',
        subject: 'A new account has been created',
        text: 'something went wrong... :(',
        attachment: [{
            data: html,
            alternative: true
        }]
    });

    EM.server.send({
        from: process.env.EMAIL_FROM || 'SuAVE <do-not-reply@gmail.com>',
        to: data.email,
        subject: 'Thanks for creating a SuAVE account',
        text: 'something went wrong... :(',
        attachment: [{
            data: message,
            alternative: true
        }]
    }, callback);

}
