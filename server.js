var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var routes = require('./app/routes')(app); // configure our routes

var config = require('./config/db');

//warning fix
mongoose.Promise = global.Promise;
mongoose.connect(config.url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {

	var port = process.env.PORT || 8081;

  	app.listen(port, function() {
		console.log("App running on port", port + ".");
	});
});