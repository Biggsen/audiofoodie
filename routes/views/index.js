var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
    locals.data = {
        statuses: [],
    };

    // Load all statuses
    view.on('init', function (next) {

        keystone.list('Status').model.find().exec(function (err, results) {

            if (err || !results.length) {
                return next(err);
            }

            locals.data.statuses = results;
            next();
        });
    });

    // Load all artists
    view.on('init', function (next) {

        keystone.list('Artist').model.find().exec(function (err, results) {

            if (err || !results.length) {
                return next(err);
            }

            locals.data.artists = results;
            next();
        });
    });

    // Load all albums
    view.on('init', function (next) {

        keystone.list('ArtistAlbum').model.find()
            .sort('-movementDate')
            .exec(function (err, results) {

            if (err || !results.length) {
                return next(err);
            }

            locals.data.albums = results;
            next();
        });
    });

	// Render the view
	view.render('index');
};
