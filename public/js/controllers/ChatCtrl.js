var $      = require('jQuery');
var moment = require('moment');

module.exports = function($scope, AuthService, MsgFactory, chatSocket) {

  $scope.msgs = [];
  $scope.post = {};

  $scope.$on('$viewContentLoaded', function(event) {
    if (AuthService.isLoggedIn()) {
      chatSocket.connect();
    }
  });

  $scope.$on("$destroy", function() {
    if ($scope.currentRoom.Name) {
      $scope.leaveRoom($scope.currentRoom);
    }
    chatSocket.disconnect();
    chatSocket.removeAllListeners();
  });

  $scope.joinRoom = function(room) {
    var data = {
      Room: room,
      User: AuthService.currentUser()
    };
    chatSocket.emit('user joined', data);
    $scope.currentRoom = room;
    $scope.refreshMsgs();
    //esc key to leave current room
    $(document).keyup(function(e) {
      if (e.keyCode == 27 && $scope.currentRoom.Name) {
        $scope.leaveRoom($scope.currentRoom);
      }
    });
  };

  $scope.leaveRoom = function(room) {
    $scope.currentRoom = {};
    $scope.msgs = [];
    $scope.post = {};
    var data = {Room: room};
    data.User = AuthService.currentUser();
    chatSocket.emit('user left', data);
  };

  $scope.refreshMsgs = function() {
    if ($scope.currentRoom._id) {
      MsgFactory.get($scope.currentRoom._id).then(function(success) {
        $scope.msgs = success.data;
      }, function(err) {
        $scope.feedback[danger] = err;
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
    } else if (!currentUser) {
      $scope.feedback[warning] = "Please log in.";
    }
  };

  //socket code
  chatSocket.on('room data', function(data) {
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

  $scope.feedbackLevels = ["success", "info", "warning", "danger"];
  $scope.feedback = {};
  for (var i = 0; i < $scope.feedbackLevels.length; i++) {
    $scope.feedback[$scope.feedbackLevels[i]] = '';
  }

  $scope.dismissAlert = function(level) {
    if (level) {
      $scope.feedback[level] = '';
    }
  };

  function dismissAllAlerts() {
    $scope.feedback = {
      success: '',
      info: '',
      warning: '',
      danger: ''
    };
  }
};