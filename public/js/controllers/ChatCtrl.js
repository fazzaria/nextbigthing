var $      = require('jQuery');
var moment = require('moment');

module.exports = function($scope, AuthService, MsgFactory, chatSocket) {
    $scope.msgs = [];
    $scope.post = {};

    $scope.joinRoom = function(room) {
        chatSocket.emit('new user', room);
        $scope.currentRoom = room;
        $scope.refreshMsgs();
    };

    $scope.leaveRoom = function(room) {
        chatSocket.emit('leave room', room);
        chatSocket.emit('request setup');
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

    if (!$scope.rooms) {
        chatSocket.emit('request setup');
    }

    chatSocket.on('setup', function(data) {
        console.log("setup");
        $scope.rooms = data.rooms;
    });

    chatSocket.on('user joined', function(data) {
    });

    chatSocket.on('message created', function(data) {
        $scope.refreshMsgs();
    });

    $scope.formatDate = function(dateString) {
        var date = moment(dateString, "YYYY-MM-DD HH:mm:ss.SSSZ");
        var yesterday = moment().subtract(1, 'days');
        var lastWeek = moment().subtract(1, 'weeks');
        if (date.isAfter(yesterday)) {
            return date.format('h:mm A');
        }
        if (date.isAfter(lastWeek)) {
            return date.format('dddd');
        }
        if (date.isAfter(lastMonth)) {
            return date.format('M-DD');
        }
        return date.format('M-DD-YYYY');
    }
};