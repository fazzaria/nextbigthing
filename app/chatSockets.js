var Msg = require('./models/msg');
var User = require('./models/user').model;
var Room = require('./models/room');

module.exports = function(io) {

	function getRooms(callback) {
		Room.find(function(err, rooms) {
			if (err) {
				console.log("room find error", err);
			} else callback(rooms);
		});
	}

	var chatDaemon = {
		UserName: 'ChatDaemon',
		DisplayName: 'ChatDaemon'
	};

	io.on('connection', function(socket) {
		console.log("user connect");
		//maintain state of user and room on server side
		var userRoomData = {};
		var inRoom = false;

		getRooms(function(rooms) {
			socket.emit('room data', {
				rooms: rooms
			});

			var roomNames = [];
			var rulesets = [];

			for (var i = 0; i < rooms.length; i++) {
				roomNames.push(rooms[i].Name);
				if (rooms[i].RulesetName) {
					rulesets.push(require('./rulesets/' + rooms[i].RulesetName));
				} else {
					rulesets.push({});
				}
			}
		});

		socket.on('request rooms', function(data) {
			getRooms(function(rooms) {
				socket.emit('room data', {
					rooms: rooms
				});
			});
		});

		socket.on('user joined', function(data) {
			console.log("user join event");
			userRoomData = data;
			inRoom = true;
			socket.join(data.Room.Name);
			var numClients = numClientsInRoom('/', data.Room.Name);
			updateUsersOnline(data.Room.Name, numClients);
			io.in(data.Room.Name).emit('user joined');
			addMessage({
				Author: chatDaemon,
				Content: data.User.DisplayName + ' has joined the room.',
				Room: data.Room
			});
		});

		//manual exit event
		socket.on('user left', function(data) {
			console.log("user left event");
			userLeave(userRoomData);
		});

		//window navigation or connection loss event
		socket.on('disconnect', function(data) {
			console.log("disconnect event");
			if (inRoom) {
				userLeave(userRoomData);
			}
		});

		socket.on('sent message', function(data) {
			addMessage(data);
			if(data.Room.RulesetName) {
				//rulesets[roomNames.indexOf(data.Room.Name)].checkMessage(data.Content);
			}
		});

		function userLeave(data) {
			console.log("userLeave function called");
			socket.leave(data.Room.Name);
			updateUsersOnline(data.Room.Name, -1);
			io.in(data.Room.Name).emit('user left');
			addMessage({
				Author: chatDaemon,
				Content: data.User.DisplayName + ' has left the room.',
				Room: data.Room
			});
			inRoom = false;
			userRoomData.Room = {};
		}

		function addMessage(data) {
			var newMsg = new Msg({
				Author: data.Author,
				Content: data.Content,
				Room: data.Room
			});

			newMsg.save(function(err, msg) {
				if (err) {
					console.log("msg save error", err);
				}
				io.in(data.Room.Name).emit('new message', msg);
			});
		}

		function updateUsersOnline(roomName, number) {
			var numObj;
			if (number == -1) {
				numObj = { $inc: { CurrentUsers: number } };
			} else {
				numObj = { CurrentUsers: number };
			}
			Room.findOneAndUpdate({ Name: roomName }, numObj, function(err, room) {
				if (err) {
				  console.log("update users online error", err); 
				}
				else {
					//refresh room data for all sockets
					getRooms(function(rooms) {
						io.sockets.emit('room data', {
							rooms: rooms
						});
					});
				} 
			});
		}

		function numClientsInRoom(namespace, roomName) {
			if (io.nsps[namespace].adapter.rooms[roomName].sockets) {
				return Object.keys(io.nsps[namespace].adapter.rooms[roomName].sockets).length;
			} else {
				return 0;
			}
		}
	}); // end io on connect
}; // end export