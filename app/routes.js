require('./models/user').model;

module.exports = function() {
	
	var router = require('express').Router();

	router.use(function(req, res, next) {
		console.log(req.body);
		//authenticate user id
		//rewrite all api calls/data requests in chatsockets
		next();
	});

	/*router.get('/a', function(req, res) {
		console.log('api');
		res.json({message: "api is working."});
	});*/

	require('./api/msgApi')(router);
	require('./api/userApi')(router);

	var auth = require('./api/authentication');
	router.route('/login').post(auth.login);
	router.route('/register').post(auth.register);

	return router;

};