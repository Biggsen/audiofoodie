var keystone = require('keystone');
var Album = keystone.list('ArtistAlbum');

/**
 * List Albums
 */
exports.list = function(req, res) {
    Album.model.find(function(err, items) {

        if (err) return res.json({ err: err });

        res.json({
            album: items
        });

    });
}

/**
 * Get Album by ID
 */
exports.get = function(req, res) {
    Album.model.findById(req.params.id).exec(function(err, item) {

        if (err) return res.json({ err: err });
        if (!item) return res.json('not found');

        res.json({
            album: item
        });

    });
}

/**
 * Create an Album
 */
exports.create = function(req, res) {

    var item = new Album.model(),
        data = (req.method == 'POST') ? req.body : req.query;

    item.getUpdateHandler(req).process(data, function(err) {

        if (err) return res.json({ error: err });

        res.json({
            album: item
        });

    });
}

/**
 * Patch Album by ID
 */
exports.update = function(req, res) {

    Album.model.findById(req.params.id).exec(function(err, item) {

        if (err) return res.json({ err: err });
        if (!item) return res.json({ err: 'not found' });

        var data = (req.method == 'PUT') ? req.body : req.query;

        item.getUpdateHandler(req).process(data, function(err) {

            if (err) return res.json({ err: err });

            res.json({
                album: item
            });

        });

    });
}

/**
 * Delete Album by ID
 */
exports.remove = function(req, res) {
    Album.model.findById(req.params.id).exec(function (err, item) {

        if (err) return res.json({ dberror: err });
        if (!item) return res.json('not found');

        item.remove(function (err) {
            if (err) return res.json({ dberror: err });

            return res.json({
                success: true
            });
        });

    });
}
