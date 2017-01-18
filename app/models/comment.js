var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	Content: String,
	Author: String,
	DatePosted: Date
});

module.exports = mongoose.model('Comment', CommentSchema);