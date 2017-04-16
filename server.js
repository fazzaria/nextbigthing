var express        = require('express');
var app            = express();
var io             = require('socket.io');
var http           = require('http');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var path           = require('path');
var passport       = require('passport');
var jwt            = require('express-jwt');

var server = http.createServer(app);
io = io(server);

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(__dirname + '/public'));

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
	if (req.method == 'OPTIONS') {
		res.status(200).end();
	} else {
		next();
	}
});

// ROUTING ================================================== |

var routes = require('./app/routes'); // configure our routes

//user auth functions
require('./app/api/passport')();
app.use(passport.initialize());
app.use('/api', routes());

var auth = jwt({
	secret: 'password',
	userProperty: 'payload'
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401);
		res.json({"message" : err.name + ": " + err.message});
	}
});

require('./app/chatSockets')(io);

var config = require('./config/config.json');

//warning fix
mongoose.Promise = global.Promise;
mongoose.connect(config.url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
	var port = process.env.PORT || 8081;
	server.listen(port, function() {
		console.log("Server running on port", port + ".");
	});
});