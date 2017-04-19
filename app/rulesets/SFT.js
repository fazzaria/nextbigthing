var gameSettings = {
	chatDaemonForJoinAndLeave: false
};

module.exports.makeMove = function(msg, callback) {
	console.log("SFT move made", msg);
	gameResult = "SFT result, message: " + msg;
	callback(gameResult);
};

module.exports.settings = gameSettings;