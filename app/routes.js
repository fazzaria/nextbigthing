var path = require('path');

var routes = function(app) {

	var router = require('express').Router();

	router.get('/', function(req, res) {
		return res.status(200).json({message: 'connected!'});
	});

	router.use(function(req, res, next) {
		console.log('api request received', req.body);
		next();
	});

	router.get('/', function(req, res) {
		res.json({message: "api is working."});
	});

	app.use('/api', router);

	require('./api/userApi');
	require('./api/commentApi');
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
};

module.exports = routes;