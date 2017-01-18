var path = require('path');

var routes = function() {
	
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

	return router;

};

module.exports = routes;