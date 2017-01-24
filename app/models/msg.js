var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	UserName: String,
	DisplayName: String
});

var MsgSchema = new Schema({
	Content: String,
	Author: userSchema,
	DatePosted: {
		type: Date,
		default: Date.now
	},
	Room: { type: Schema.Types.ObjectId, ref: 'Room' }
});

module.exports = mongoose.model('Msg', MsgSchema);