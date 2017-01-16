var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
//data source: https://mlab.com/databases/fazzaria
//mao: whoever makes it through the day 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))

var db;


mongoose.connect('mongodb://fazzaria:frogsaregreen@ds111549.mlab.com:11549/fazzaria');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {

	app.post("/api/register", function(req, res) {

	});

	app.post("/api/login", function(req, res) {

	});

	app.get("/api/USERID", function(req, res) {

	});

	app.post('/getComments', function(req, res) {
		var comments = db.collection("Comments").find().toArray(function(err, results) {
			if (err) {
				console.log("err");
				return console.log(err);
			}
			res.send(results);
		});
	});

	app.post('/postComment', function(req, res) {
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

  	app.listen(8081, function() {
		console.log("App running on 8081. Godspeed.");
	});
});