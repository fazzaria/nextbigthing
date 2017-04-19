var gameSettings = {
	chatDaemonForJoinAndLeave: false
};

module.exports.makeMove = function(msg, callback) {
	console.log("CSPAN move made", msg);
	gameResult = "CSPAN result, message: " + msg;
	callback(gameResult);
};

module.exports.settings = gameSettings;