var $      = require('jQuery');
var moment = require('moment');

module.exports = function($scope, AuthService, MsgFactory, chatSocket) {
    $scope.msgs = [];
    $scope.post = {};

    $scope.joinRoom = function(room) {
        var data = {room: room};
        data.user = AuthService.currentUser();
        chatSocket.emit('new user', data);
        $scope.currentRoom = room;
        $scope.refreshMsgs();
    };

    $scope.leaveRoom = function(room) {
        var data = {room: room};
        data.user = AuthService.currentUser();
        chatSocket.emit('leave room', data);
        $scope.currentRoom = {};
        $scope.msgs = [];
        $scope.post = {};
        $scope.rooms = [];
        chatSocket.emit('request rooms');
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

    chatSocket.on('room data', function(data) {
        $scope.rooms = data.rooms;
    });

    chatSocket.on('user joined', function(data) {
    });

    chatSocket.on('user left', function(data) {
        chatSocket.emit('request rooms');
    });

    chatSocket.on('message created', function(data) {
        $scope.refreshMsgs();
    });

    $scope.formatDate = function(dateString) {
        var date = moment(dateString, "YYYY-MM-DD HH:mm:ss.SSSZ");
        var yesterday = moment().subtract(1, 'days').hours(23).minutes(59);
        var lastWeek = moment().subtract(1, 'weeks').hours(23).minutes(59);
        var lastMonth = moment().subtract(1, 'months').hours(23).minutes(59);
        if (date.isAfter(yesterday)) {
            return date.format('h:mm A');
        }
        if (date.isAfter(lastWeek)) {
            return date.format('ddd');
        }
        if (date.isAfter(lastMonth)) {
            return date.format('M-DD');
        }
        return date.format('M-DD-YYYY');
    };

    $scope.hideChatBot = false;
    $scope.toggleHideBot = function() {
        $scope.hideChatBot = !$scope.hideChatBot;
    };

    //ESC key to exit
    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            if($scope.currentRoom.Name) {
                $scope.leaveRoom($scope.currentRoom);
            }
        }
    });

    if (!$scope.rooms) {
        chatSocket.emit('request rooms');
    }
};