var keystone = require('keystone'),
    Status = keystone.list('Status'),
    Artist = keystone.list('Artist'),
    Album = keystone.list('ArtistAlbum'),
    request = require('superagent');

exports = module.exports = function (req, res) {

    var authType = req.cookies['audiofoodie.ttype'];
    var authToken = req.cookies['audiofoodie.token'];

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
            .exec(function(err, results){

            if (err || !results.length) { return next(err) ;}
            locals.data.status = results;
            locals.section = locals.data.status[0].key;
            next();
        });
    });

    view.query('data.statuses', Status.model.find());
    view.query('data.artists', Artist.model.find());
    view.query('data.albums', Album.model
        .find()
        .where('user', req.user)
        .populate('status'));

    view.on('post', function (next) {

        var pAction = req.body.action;
        if (pAction == 'demote') {
            var newStatusType = 'storage';
            var newStatusOrder = req.body.statusOrder;
            locals.data.newStatusDate = newStatusType + newStatusOrder + 'Date';
        };
        if (pAction == 'promote') {
            var newStatusType = 'filter';
            var newStatusOrder = Number(req.body.statusOrder) + 1
            locals.data.newStatusDate = newStatusType + newStatusOrder + 'Date';
        };

        Status.model
            .find({
                type: newStatusType,
                order: newStatusOrder })
            .exec(function (err, results) {

            if (err || !results.length) { return next(err); }
            locals.data.newStatusId = results[0].id;
            locals.data.newStatusOrder = newStatusOrder;
            next();
        });
    });

    view.on('post', function (next) {

        req.body.status = locals.data.newStatusId;
        req.body[locals.data.newStatusDate] = Date.now();
        req.body.movementDate = Date.now();
        req.body.movement = 'on';
        console.log(req.body);
        //next();
        request
            .put(process.env.DOMAIN + '/api/album/' + req.body.albumId)
            .set('Authorization', authType + ' ' + authToken)
            .send(req.body)
            .end(function(err, response) {
                if (err) {
                    console.log('Error with the AJAX request: ', err)
                    req.flash('error', 'Something went wrong.');
                    return;
                }
                console.log('Update album');
                req.flash('success', 'Album successfully updated');
                return res.redirect('/status/' + locals.data.newStatusOrder);
            });
    });

	// Render the view
	view.render('status');
};
