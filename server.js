var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
//data source: https://mlab.com/databases/fazzaria

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));
require('./app/routes')(app); // configure our routes

var config = require('./config/db');

//warning fix
mongoose.Promise = global.Promise;
mongoose.connect(config.url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {

	require('./app_api/initApi')(app);

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

	var port = process.env.PORT || 8081;

  	app.listen(port, function() {
		console.log("App running on port", port + ".");
	});
});