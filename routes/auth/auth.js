var keystone = require('keystone'),
    request = require('request');

exports = module.exports = function (req, res) {

    if (!req.session.userId) {
        return res.redirect('/signin');
    }

    var view = new keystone.View(req, res);

    view.on('init', function(next) {

        var options = { method: 'POST',
            url: 'https://audiofoodie.eu.auth0.com/oauth/token',
            headers: { 'content-type': 'application/json' },
            body: '{"client_id":"AEk4Mby14VKk6LifM1ZcjQuRDX7XL1wS","client_secret":"' + process.env.AUTH_SECRET + '","audience":"https://audiofoodie.herokuapp.com","grant_type":"client_credentials"}' };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            var authResponse = JSON.parse(body);
            res.cookie('audiofoodie.ttype' , authResponse.token_type);
            res.cookie('audiofoodie.token' , authResponse.access_token);
            next()
        });
    });

    view.on('init', function(next) {
        res.redirect('/');
    });

    // Render the view
    view.render('auth');
};