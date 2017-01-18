var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	UserName: String,
	DisplayName: String,
	Pwd: String,
	DateRegistered: Date
});

module.exports = mongoose.model('User', UserSchema);