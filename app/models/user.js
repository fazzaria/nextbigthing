var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new Schema({
	UserName: {
		type: String,
		unique: true,
		required: true
	},
	DisplayName: {
		type: String,
		required: true
	},
	DateRegistered: {
		type: Date,
		default: Date.now
	},
	hash: String,
	salt: String
});

UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 100000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 100000, 512, 'sha512').toString('hex');
	return this.hash === hash;
};

UserSchema.methods.generateJwt = function() {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jwt.sign({
		_id: this._id,
		UserName: this.UserName,
		DisplayName: this.DisplayName,
		DateRegistered: this.DateRegistered,
		exp: parseInt(expiry.getTime() / 1000)
	}, "password");
};

module.exports.model = mongoose.model('User', UserSchema);
module.exports.schema = UserSchema;