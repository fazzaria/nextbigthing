var $      = require('jQuery');
var moment = require('moment');

module.exports = function($scope, AuthService, MsgFactory, chatSocket) {

  //Chat code
  $scope.msgs = [];
  $scope.post = {};

  $scope.$on('$viewContentLoaded', function(event) {
    console.log("content loaded (this should only fire once)");
    chatSocket.connect();
  });

  $scope.$on("$destroy", function() {
    chatSocket.disconnect();
    chatSocket.removeAllListeners();
    
  });

  $scope.joinRoom = function(room) {
    var data = {
      room: room,
      user: AuthService.currentUser()
    };
    chatSocket.emit('user joined', data);
    $scope.currentRoom = room;
    $scope.refreshMsgs();
    $(document).keyup(function(e) {
      console.log("keyup", e.keyCode);
      if (e.keyCode == 27) {
        console.log("?", $scope.leaveRoom);
        $scope.leaveRoom(room);
      }
    });
  };

  $scope.leaveRoom = function(room) {
    var data = {room: room};
    data.user = AuthService.currentUser();
    chatSocket.emit('user left', data);
    $scope.currentRoom = {};
    $scope.msgs = [];
    $scope.post = {};
    //$scope.rooms = [];
    //server should automatically refresh room data for all sockets
    //chatSocket.emit('request rooms');
  };

  $scope.refreshMsgs = function() {
    if ($scope.currentRoom._id) {
      MsgFactory.get($scope.currentRoom._id).then(function(success) {
        $scope.msgs = success.data;
        //$scope.feedback = "";
      }, function(err) {
        //$scope.feedback = err;
      });
    }
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
        chatSocket.emit("sent message", msg);
        $scope.post = {};
        $("#commentField").focus();
      } else {
        console.log("Did not post.");
      }
  };

  //Socket code
  chatSocket.on('room data', function(data) {
    console.log("got rooms (this should only fire once!)");
    $scope.rooms = data.rooms;
  });

  chatSocket.on('msg all', function(data) {
    console.log(data);
  });

  chatSocket.on('user joined', function(data) {
  });

  chatSocket.on('user left', function(data) {
  });

  chatSocket.on('new message', function(msg) {
    $scope.msgs.push(msg);
  });

  //UI Code
  $scope.formatDateRelative = function(dateString) {
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
      return date.format('M/DD');
    }
    return date.format('M/DD/YYYY');
  };

  $scope.formatDateAbsolute = function(dateString) {
    var date = moment(dateString, "YYYY-MM-DD HH:mm:ss.SSSZ");
    return date.format('M/DD/YYYY h:mm A');
  };

  $scope.hideChatBot = false;

  $scope.toggleHideBot = function() {
    $scope.hideChatBot = !$scope.hideChatBot;
  };

  //ESC key to exit

  $scope.feedback = {
    success: '',
    info: '',
    warning: '',
    danger: ''
  };

  $scope.dismissAlert = function(level) {
    if (level) {
      $scope.feedback[level] = '';
    }
  };
};