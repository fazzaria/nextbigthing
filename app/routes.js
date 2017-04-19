require('./models/user.js').model;

module.exports = function() {
	
	var router = require('express').Router();

	router.use(function(req, res, next) {
		//validate token
		console.log("api route hit");
		next();
	});

	require('./api/msgApi.js')(router);
	require('./api/userApi.js')(router);

	var auth = require('./api/authentication.js');
	router.route('/login').post(auth.login);
	router.route('/register').post(auth.register);

	return router;
};