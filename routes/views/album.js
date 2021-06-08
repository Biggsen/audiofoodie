var keystone = require('keystone');
var Album = keystone.list('ArtistAlbum');
var Status = keystone.list('Status');
var request = require('superagent');

exports = module.exports = function (req, res) {

    var authType = req.cookies['audiofoodie.ttype'];
    var authToken = req.cookies['audiofoodie.token'];

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
    var album;

    // Load album
    view.on('init', function (next) {
        Album.model
            .find({ key: lKey } )
            .populate('artist status')
            .exec(function (err, result) {

            if (err || !result.length) { return next(err); }
            locals.data.album = result;
            album = locals.data.album[0];
            next();
        });
    });

    view.query('data.statuses', keystone.list('Status').model.find());

    // -----------------------------------------
    // ================= VIEW ==================
    // -----------------------------------------

    if (lAction == 'view') {
        locals.action.view = true;
        view.on('init', function (next) {
            next();
        });

        view.on('post', function (next) {
            var pAction = req.body.action;
            if (pAction == 'demote') {
                var newStatusDate = 'storage' + album.status[0].order + 'Date';
            };
            if (pAction == 'promote') {
                var newStatusDate = 'filter' + (album.status[0].order + 1) + 'Date';
            };
            req.body[newStatusDate] = Date.now();
            req.body.movementDate = Date.now();
            req.body.movement = 'on';
            console.log(req.body);
            //next();
            request
                .put(process.env.DOMAIN + '/api/album/' + album.id)
                .set('Authorization', authType + ' ' + authToken)
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
        locals.action.update = true;

        view.on('init', function(next){
            next();
        });

        view.on('post', function (next) {
            console.log(req.body);
            request
                .put(process.env.DOMAIN + '/api/album/' + req.body.id)
                .set('Authorization', authType + ' ' + authToken)
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
        });
    }

    // -----------------------------------------
    // ================= DELETE ================
    // -----------------------------------------

	// Render the view
	view.render('album');
};
