var keystone = require('keystone'),

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    if (!req.session.userId) {
        return res.redirect('/signin');
    }

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'me';
    locals.data = {};

    // Render the view
    view.render('me');
};