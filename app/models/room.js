var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
	Name: {
		type: String,
		unique: true
	},
	Description: String,
	CurrentUsers: Number
});

module.exports = mongoose.model('Room', RoomSchema);