var express = require('express');
var xapp = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
//data source: https://mlab.com/databases/fazzaria

xapp.use(bodyParser.json());
xapp.use(bodyParser.json({ type: 'application/vnd.api+json' }));
xapp.use(bodyParser.urlencoded({ extended: true }));
xapp.use(methodOverride('X-HTTP-Method-Override'));
xapp.use(express.static(__dirname + '/public'));
require('./app/routes')(xapp); // configure our routes

var config = require('./config/db');

mongoose.connect(config.url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {

	xapp.post("/api/register", function(req, res) {

	});

	xapp.post("/api/login", function(req, res) {

	});

	xapp.get("/api/USERID", function(req, res) {

	});

	xapp.post('/getComments', function(req, res) {
		var comments = db.collection("Comments").find().toArray(function(err, results) {
			if (err) {
				console.log("err");
				return console.log(err);
			}
			res.send(results);
		});
	});

	xapp.post('/postComment', function(req, res) {
		//validations and things
		if (req.body.content != "") {
			var comment = req.body;
			comment.author = "Author";
			comment.datePosted = new Date();
			db.collection("Comments").save(req.body, function(err, result) {
				if (err) {
					return console.log(err);
				}
			});
		}
		res.send("all good, bro");
	});

	var port = process.env.PORT || 8081;

  	xapp.listen(port, function() {
		console.log("App running on port", port + ".");
	});
});