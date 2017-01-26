var Msg = require('./models/msg');
var User = require('./models/user').model;
var Room = require('./models/room');

module.exports = function(io) {
	io.on('connection', function(socket) {
		var roomNames = [];

		Room.find(function(err, rooms) {
			if (err) {
				console.log(err);
			}

			for (var i = 0; i < rooms.length; i++) {
				roomNames.push(rooms[i].Name);
			}

			var defaultRoom = roomNames[0];

			//Emit the rooms array
			socket.on('request setup', function(data) {
				socket.emit('setup', {
					rooms: rooms
				});
			});

			//Listens for new user
			socket.on('new user', function(room) {
				socket.join(room.Name);
				var numClients = numClientsInRoom('/', room.Name);
				updateUsersOnline(room.Name, numClients);
				io.in(room.Name).emit('user joined');
			});

			//Listens for leave room
			socket.on('leave room', function(room) {
				socket.leave(room.Name);
				updateUsersOnline(room.Name, -1);
				io.in(room.Name).emit('user left', room);
			});

			//Listens for a new chat message
			socket.on('new message', function(data) {
				var newMsg = new Msg({
					Author: data.Author,
					Content: data.Content,
					Room: data.Room
				});
				//Save it to database
				newMsg.save(function(err, msg) {
					if (err) {
						console.log(err);
					}
					io.in(data.Room.Name).emit('message created', msg);
				});
			});

			socket.on('disconnect', function(data) {
			});

			function updateUsersOnline(roomName, number) {
				var numObj;
				if (number == -1) {
					numObj = { $inc: { CurrentUsers: number } };
				} else {
					numObj = { CurrentUsers: number };
				}
				Room.findOneAndUpdate({ Name: roomName }, numObj, function(err, room) {
					if (err) {
					  console.log(err); 
					} 
					else {
						if (number == -1) {
							rooms[roomNames.indexOf(room.Name)].CurrentUsers--;
						} else {
							rooms[roomNames.indexOf(room.Name)].CurrentUsers = number;
						}
						
						io.in(room.Name).emit('setup', {
							rooms: rooms
						});
					} 
				});
			}

			function numClientsInRoom(namespace, roomName) {
				var room = io.nsps[namespace].adapter.rooms[roomName].sockets;
				return Object.keys(room).length;
			}
		});
	});
}