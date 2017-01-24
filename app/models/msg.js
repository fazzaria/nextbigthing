var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MsgSchema = new Schema({
	Content: String,
	Author: { type: Schema.Types.ObjectId, ref: 'User' },
	DatePosted: Date,
	Room: { type: Schema.Types.ObjectId, ref: 'Room' }
});

module.exports = mongoose.model('Msg', MsgSchema);