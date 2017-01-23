var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MsgSchema = new Schema({
	Content: String,
	Author: String,
	DatePosted: Date
});

module.exports = mongoose.model('Msg', MsgSchema);