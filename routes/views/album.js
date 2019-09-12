var keystone = require('keystone');
var Album = keystone.list('ArtistAlbum');
var Status = keystone.list('Status');
var request = require('superagent');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'album';
    locals.filters = {
        albumKey: req.params.key,
        action: req.params.action,
    };
    locals.data = {};
    locals.action = {};

    var lKey = locals.filters.albumKey;
    var lAction = locals.filters.action;

    // Load album
    view.on('init', function (next) {
        Album.model
            .find({ key: lKey } )
            .populate('artist status')
            .exec(function (err, result) {

            if (err || !result.length) { return next(err); }
            locals.data.album = result;
            next();
        });
    });

    // Load all statuses
    view.on('init', function (next) {
        Status.model.find().exec(function (err, results) {
            if (err || !results.length) { return next(err); }
            locals.data.statuses = results;
            next();
        });
    });

    // -----------------------------------------
    // ================= VIEW ==================
    // -----------------------------------------

    if (lAction == 'view') {
        view.on('init', function (next) {
            locals.action.view = true;
            next();
        });
    }

    // -----------------------------------------
    // ================= ADD ===================
    // -----------------------------------------

    if (lAction == 'add') {
        view.on('init', function (next) {
            locals.action.add = true;
            next();
        });
    }

    // -----------------------------------------
    // ================= UPDATE ================
    // -----------------------------------------

    if (lAction == 'update') {
        view.on('init', function (next) {
            console.log(req.body);
            request
                .put('localhost:3000/api/album/' + req.body.id)
                .send(req.body)
                .end(function(err, res) {
                    if (err) {
                        console.log('Error with the AJAX request: ', err)
                        req.flash('error', 'Something went wrong.');
                        return;
                    }
                    console.log('Update album');
                    req.flash('success', 'Album successfully updated');
                    next();
                });
            locals.action.update = true;
            next();
        });
    }

    // -----------------------------------------
    // ================= DELETE ================
    // -----------------------------------------

	// Render the view
	view.render('album');
};
