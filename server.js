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
io = io.listen(server);

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

// END ROUTING ============================================== |

// SOCKETS     ============================================== |

//Listen for connection

var Msg = require('./app/models/msg');

io.on('connection', function(socket) {
	//Globals
	var defaultRoom = 'General';
	var rooms = ["General", "Bingo", "Stalin For Time"];

	//Emit the rooms array
	socket.emit('setup', {
		rooms: rooms
	});

	//Listens for new user
	socket.on('new user', function(data) {
		data.room = defaultRoom;
		//New user joins the default room
		socket.join(defaultRoom);
		//Tell all those in the room that a new user joined
		io.in(defaultRoom).emit('user joined', data);
	});

	//Listens for switch room
	socket.on('switch room', function(data) {
		//Handles joining and leaving rooms
		socket.leave(data.oldRoom);
		socket.join(data.newRoom);
		io.in(data.oldRoom).emit('user left', data);
		io.in(data.newRoom).emit('user joined', data);
	});

	//Listens for a new chat message
	socket.on('new message', function(data) {
		//Create message
		var newMsg = new Msg({
			Author: data.userid,
			Content: data.Content,
			Room: data.room.toLowerCase(),
			DatePosted: new Date()
		});
		//Save it to database
		newMsg.save(function(err, msg) {
			if (err) {
				console.log(err);
			}
			//Send message to those connected in the room
			io.in(msg.room).emit('message created', msg);
		});
	});

	socket.on('test', function(data) {
		data.test = defaultRoom;
		//New user joins the default room
		socket.join(defaultRoom);
		//Tell all those in the room that a new user joined
		io.in(defaultRoom).emit('alert', data);
	});
});

// END SOCKETS ================================================= |

var config = require('./config/db');

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