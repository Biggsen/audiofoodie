var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'artist';
	locals.filters = {
		artist: req.params.artist,
	};
	locals.data = {
		artists: [],
	};

	// Load the current artist
	view.on('init', function (next) {

		var q = keystone.list('Artist').model.findOne({
			slug: locals.filters.artist,
		});

		q.exec(function (err, result) {
			locals.data.artist = result;
			next(err);
		});

	});

    // Load artist albums
	if (req.params.artist) {
	    view.on('init', function (next) {

	        keystone.list('ArtistAlbum').model.find().where('artist').in([locals.data.artist.id]).sort('year').exec(function (err, results) {

	            if (err || !results.length) {
	                return next(err);
	            }

	            locals.data.albums = results;
	            next();
	        });
	    });
	}

	view.query('data.statuses', keystone.list('Status').model.find());
	view.query('data.artists', keystone.list('Artist').model
		.find()
		.where('user', req.user)
		.sort('name')
	);

	// Render the view
	view.render('artist');
};
