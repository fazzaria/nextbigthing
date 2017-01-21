var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function() {
	passport.use(new LocalStrategy({
		usernameField: 'UserName'
		},
		function(username, password, done) {
			console.log('passport working');
			User.findOne({ UserName: username }, function(err, user) {
				if (err) {
					return done(err);
				}
				//Return if user not wrong
				if(!user) {
					return done(null, false, {
						message: 'User not found'
					});
				}
				//Return if password is wrong
				if(!user.validPassword(password)) {
					return done(null, false, {
						message: 'Invalid password'
					});
				}
				//If credentials are correct, return the user object
				return done(null, user);
			});
		}
	));
};