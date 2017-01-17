var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	UserName: String,
	Pwd: String,
	DisplayName: String
});

module.exports = mongoose.model('User', UserSchema);