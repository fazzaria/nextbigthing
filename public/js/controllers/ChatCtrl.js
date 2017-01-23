var $ = require('jQuery');
module.exports = function($scope, AuthService, MsgFactory, chatSocket) {
    $scope.msgs = [];
    $scope.postText = "";
    $scope.currentRoom = "";
    $scope.rooms = [];

    $scope.selectRoom = function(room) {
        chatSocket.emit('new user', {room: room});
        $scope.currentRoom = room;
        $scope.refreshMsgs();
    };

    $scope.leaveRoom = function() {
        $scope.currentRoom = "";
        chatSocket.emit('leave room', {room: $scope.currentRoom});
    };

    $scope.refreshMsgs = function() {
        MsgFactory.get({Room: $scope.currentRoom}).then(function(success) {
            $scope.msgs = success.data;
            $scope.feedback = "";
        }, function(err) {
            $scope.feedback = err;
        });
    };

    $scope.postMsg = function() {
        var currentUser = AuthService.currentUser();
        if (currentUser && $scope.postText) {
            var msg = {
                userid: currentUser._id,
                Content: $scope.postText,
                Room: 'General'
            }
            chatSocket.emit("new message", msg);
            $scope.postText = "";
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