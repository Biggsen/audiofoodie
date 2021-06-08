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

    view.query('data.statuses', keystone.list('Status').model.find());
    view.query('data.artists', keystone.list('Artist').model.find());
    view.query('data.albums', keystone.list('ArtistAlbum').model.find().sort('-movementDate'));

	// Render the view
	view.render('index');
};
