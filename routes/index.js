/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Auth0
var authCheck = jwt({
  	secret: jwks.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		// YOUR-AUTH0-DOMAIN name e.g https://prosper.auth0.com
		jwksUri: "https://audiofoodie.eu.auth0.com/.well-known/jwks.json"
    }),
    // This is the identifier we set when we created the API
    audience: 'https://audiofoodie.herokuapp.com',
    issuer: 'https://audiofoodie.eu.auth0.com/',
    algorithms: ['RS256']
});

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api'),
    auth: importRoutes('./auth'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);
	app.all('/signin', routes.views.signin);
    app.all('/signout', routes.views.signout);
    app.all('/me', routes.views.me);
	//app.get('/blog/:category?', routes.views.blog);
	//app.get('/blog/post/:post', routes.views.post);
	//app.get('/gallery', routes.views.gallery);
    //app.all('/contact', routes.views.contact);
	app.all('/audioplate', routes.views.audioplate);
	app.all('/consumed', routes.views.consumed);
	app.all('/artist/:artist?', routes.views.artist);
	app.all('/status/:id?', routes.views.status);
	app.all('/album/:action?/:key?', routes.views.album);
    app.all('/auth', routes.auth.auth);

	// API
	app.get('/api/album', routes.api.album.list);
	app.get('/api/album/:id', routes.api.album.get);
	app.post('/api/album', authCheck, routes.api.album.create);
	app.put('/api/album/:id', authCheck, routes.api.album.update);
	app.delete('/api/album/:id', authCheck, routes.api.album.remove);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
