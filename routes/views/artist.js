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
    view.on('init', function (next) {

    	if (req.params.artist) {

	        keystone.list('ArtistAlbum').model.find().where('artist').in([locals.data.artist.id]).sort('year').exec(function (err, results) {

	            if (err || !results.length) {
	                return next(err);
	            }

	            locals.data.albums = results;
	            next();
	        });
	    } else {
	    	next();
	    }
    });


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

	// Load other artists
	view.on('init', function (next) {

		var q = keystone.list('Artist').model.find().sort('name');

		q.exec(function (err, results) {
			locals.data.artists = results;
			next(err);
		});

	});

	// Render the view
	view.render('artist');
};
