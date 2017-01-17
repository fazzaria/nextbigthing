var express = require('express');

var initApi = function(app) {
	var Comment = require('../app/models/comment');

	var router = express.Router();
	router.use(function(req, res, next) {
		console.log('api request received');
		next();
	});

	router.get('/', function(req, res) {
		res.json({message: "api is working."});
	});

	app.use('/api', router);

	require('./userApi')(router);
};

module.exports = initApi;