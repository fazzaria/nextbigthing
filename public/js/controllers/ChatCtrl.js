var $ = require('jQuery');
module.exports = function($scope, AuthService, MsgFactory, chatSocket) {
    $scope.msgs = [];
    $scope.post = {};
    $scope.currentRoom = {};
    $scope.rooms = [];

    $scope.selectRoom = function(room) {
        chatSocket.emit('new user', {roomName: room});
        $scope.currentRoom = room;
        $scope.refreshMsgs();
    };

    $scope.leaveRoom = function() {
        $scope.currentRoom = {};
        chatSocket.emit('leave room', {roomName: $scope.currentRoom.Name});
    };

    $scope.refreshMsgs = function() {
        MsgFactory.get({Room: $scope.currentRoom}).then(function(success) {
            $scope.msgs = success.data;
            $scope.feedback = "";
        }, function(err) {
            $scope.feedback = err;
        });
    };

    $scope.postMsg = function(text) {
        var currentUser = AuthService.currentUser();
        console.log(currentUser, text)
        if (currentUser && text) {
            var msg = {
                userid: currentUser._id,
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

    chatSocket.on('setup', function(data) {
        $scope.rooms = data.rooms;
    });

    chatSocket.on('user joined', function(data) {
        console.log('user joined');
    });

    chatSocket.on('message created', function(data) {
        console.log("message created");
        $scope.refreshMsgs();
    })

};