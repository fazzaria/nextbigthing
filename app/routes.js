require('./models/user');

module.exports = function() {
	
	var router = require('express').Router();

	router.use(function(req, res, next) {
		next();
	});

	router.get('/', function(req, res) {
		res.json({message: "api is working."});
	});

	require('./api/msgApi')(router);
	require('./api/userApi')(router);

	var auth = require('./api/authentication');
	router.route('/login').post(auth.login);
	router.route('/register').post(auth.register);

	return router;

};