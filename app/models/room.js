var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
	Name: String
});

module.exports = mongoose.model('Room', RoomSchema);