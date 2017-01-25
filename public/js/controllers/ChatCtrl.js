var $ = require('jQuery');
module.exports = function($scope, AuthService, MsgFactory, chatSocket) {
    $scope.msgs = [];
    $scope.post = {};
    $scope.rooms = [];

    $scope.joinRoom = function(room) {
        chatSocket.emit('new user', room);
        $scope.currentRoom = room;
        $scope.refreshMsgs();
    };

    $scope.leaveRoom = function(room) {
        chatSocket.emit('leave room', room);
        $scope.currentRoom = {};
        $scope.msgs = [];
        $scope.post = {};
    };

    $scope.refreshMsgs = function() {
        MsgFactory.get($scope.currentRoom._id).then(function(success) {
            $scope.msgs = success.data;
            $scope.feedback = "";
        }, function(err) {
            $scope.feedback = err;
        });
    };

    $scope.postMsg = function(text) {
        var currentUser = AuthService.currentUser();
        if (currentUser && text) {
            var msg = {
                Author: {
                    UserName: currentUser.UserName,
                    DisplayName: currentUser.DisplayName
                },
                Content: text,
                Room: $scope.currentRoom
            };
            chatSocket.emit("new message", msg);
            $scope.post = {};
            $("#commentField").focus();
        } else {
            console.log("Did not post.");
        }
    };

    chatSocket.emit('request setup');

    chatSocket.on('setup', function(data) {
        $scope.rooms = data.rooms;
    });

    chatSocket.on('user joined', function(data) {
    });

    chatSocket.on('message created', function(data) {
        $scope.refreshMsgs();
    });
};