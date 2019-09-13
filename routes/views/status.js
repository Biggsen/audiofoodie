var keystone = require('keystone'),
    Status = keystone.list('Status'),

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
    var locals = res.locals;

    // Set locals
    locals.filters = {
        statusId: req.params.id
    };
    locals.data = {
        statuses: [],
    };

    if (!req.session.userId) {
        return res.redirect('/signin');
    }

    view.on('init', function (next) {

        Status.model
            .find({ order: locals.filters.statusId}) 
            .sort('type')
            .exec(function(err, result){
                console.log(result);
                locals.data.status = result;
                locals.section = locals.data.status[0].key;
                next();
            });
    });

    view.on('init', function (next) {

        Status.model
            .find()
            .exec(function (err, results) {

            if (err || !results.length) {
                return next(err);
            }

            locals.data.statuses = results;
            next();
        });
    });

    // Load all artists
    view.on('init', function (next) {

        keystone.list('Artist').model
            .find()
            .exec(function (err, results) {

            if (err || !results.length) {
                return next(err);
            }

            locals.data.artists = results;
            next();
        });
    });

    // Load all albums
    view.on('init', function (next) {

        keystone.list('ArtistAlbum').model
            .find()
            .where('user', req.user)
            .exec(function (err, results) {

            if (err || !results.length) {
                return next(err);
            }

            locals.data.albums = results;
            next();
        });
    });

	// Render the view
	view.render('status');
};
