var keystone = require('keystone'),

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'signin';
    locals.form = req.body;
    locals.data = {};

    // Not sure what all this below is doing...
    view.on('post', { action: 'signin' }, function(next) {

        if (!req.body.email || !req.body.password) {
            req.flash('error', 'Please enter your username and password.');
            return next();
        }

        var onSuccess = function() {
            if (req.body.target && !/join|signin/.test(req.body.target)) {
                console.log('[signin] - Set target as [' + req.body.target + '].');
                res.redirect(req.body.target);
            } else {
                res.redirect('/');
            }
        }

        var onFail = function() {
            req.flash('error', 'Your username or password were incorrect, please try again.');
            return next();
        }

        keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);

    });

    // Render the view
    view.render('signin');
};