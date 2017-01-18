var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
//var cookieParser   = require('cookie-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var path           = require('path');
var passport       = require('passport');
var jwt            = require('express-jwt');

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(__dirname + '/public'));

require('./app/models/user');

// ROUTING ================================================== |

var routes = require('./app/routes'); // configure our routes

//user auth functions
require('./app/api/config/passport')();
app.use(passport.initialize());
app.use('/api', routes());

var auth = jwt({
	secret: 'password',
	userProperty: 'payload'
});
var settingsCtrl = require('./app/api/controllers/settingsCtrl');
app.get('/settings', auth, settingsCtrl.settingsRead);

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401);
		res.json({"message" : err.name + ": " + err.message});
	}
});

// END ROUTING ============================================== |

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