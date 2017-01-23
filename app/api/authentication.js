var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.register = function(req, res) {
	var user = new User();
	user.UserName = req.body.UserName;
	user.DisplayName = req.body.DisplayName;
    user.DateRegistered = new Date();

    user.setPassword(req.body.Pwd);

    user.save(function(err) {
    	if (err) {
    		res.send(err);
    	}
    	var token;
    	token = user.generateJwt();
    	res.status(200);
    	res.json({
    		"token": token
    	});
    })(req, res);
};

module.exports.login = function(req, res) {
	passport.authenticate('local', function(err, user, info) {
		var token;
		//If Passport throws/catches an error
		if (err) {
			console.log("passport", err);
			res.status(404).json(err);
			err;
		}
		//If a user is found
		if(user) {
			token = user.generateJwt();
			res.status(200);
			res.json({
				"token": token
			});
		} else {
			//If user is not found
			res.status(401).json(info);
		}
	})(req, res);
};