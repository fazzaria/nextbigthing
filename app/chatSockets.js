var Msg = require('./models/msg');
var User = require('./models/user').model;
var Room = require('./models/room');

module.exports = function(io) {
	io.on('connection', function(socket) {
		var roomNames = [];
		var rulesets = [];
		var chatbot = {
			UserName: 'ChatBot',
			DisplayName: 'ChatBot'
		};

		Room.find(function(err, rooms) {
			if (err) {
				console.log(err);
			}

			for (var i = 0; i < rooms.length; i++) {
				roomNames.push(rooms[i].Name);
				if (rooms[i].RulesetName) {
					rulesets.push(require('./rulesets/' + rooms[i].RulesetName));
				} else {
					rulesets.push({});
				}
			}

			var defaultRoom = roomNames[0];

			socket.on('request rooms', function(data) {
				socket.emit('room data', {
					rooms: rooms
				});
			});

			socket.on('new user', function(data) {
				socket.join(data.room.Name);
				var numClients = numClientsInRoom('/', data.room.Name);
				updateUsersOnline(data.room.Name, numClients);
				io.in(data.room.Name).emit('user joined');
				addMessage({
					Author: chatbot,
					Content: data.user.DisplayName + ' has joined the room.',
					Room: data.room
				});
			});

			socket.on('leave room', function(data) {
				socket.leave(data.room.Name);
				updateUsersOnline(data.room.Name, -1);
				io.in(data.room.Name).emit('user left');
				addMessage({
					Author: chatbot,
					Content: data.user.DisplayName + ' has left the room.',
					Room: data.room
				});
			});

			socket.on('new message', function(data) {
				addMessage(data);
				if(data.Room.RulesetName) {
					rulesets[roomNames.indexOf(data.Room.Name)].checkMessage(data.Content);
				}
			});

			socket.on('disconnect', function(data) {
			});

			function addMessage(data) {
				var newMsg = new Msg({
					Author: data.Author,
					Content: data.Content,
					Room: data.Room
				});

				newMsg.save(function(err, msg) {
					if (err) {
						console.log(err);
					}
					io.in(data.Room.Name).emit('message created', msg);
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
					  console.log(err); 
					} 
					else {
						if (number == -1) {
							rooms[roomNames.indexOf(room.Name)].CurrentUsers--;
						} else {
							rooms[roomNames.indexOf(room.Name)].CurrentUsers = number;
						}
						
						io.in(room.Name).emit('room data', {
							rooms: rooms
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
		});
	});
};