var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    locals.section = 'signout';

    // clearing auth cookies
    res.clearCookie('audiofoodie.ttype');
    res.clearCookie('audiofoodie.token');
    keystone.session.signout(req, res, function() {
        res.redirect('/');
    });

};