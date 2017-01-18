var path = require('path');

var routes = function(app) {
	
	var router = require('express').Router();

	router.use(function(req, res, next) {
		console.log('api request received', req.body);
		next();
	});

	router.get('/', function(req, res) {
		res.json({message: "api is working."});
	});

	require('./api/userApi')(router);
	require('./api/commentApi')(router);

	app.use('/api', router);

};

module.exports = routes;