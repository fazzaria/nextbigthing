var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var path           = require('path');

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(__dirname + '/public'));

var routes = require('./app/routes')(app); // configure our routes

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

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