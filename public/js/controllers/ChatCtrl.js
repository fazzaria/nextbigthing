var $      = require('jQuery');
var moment = require('moment');

module.exports = function($scope, AuthService, MsgFactory, chatSocket) {

  $scope.msgs = [];
  $scope.post = {};
  $scope.rulesets = [];
  $scope.inRoom = false;

  $scope.$on('$viewContentLoaded', function(event) {
    if (AuthService.isLoggedIn()) {
      chatSocket.connect();
      $(document).keyup(keyupHandler);
    }
  });

  $scope.$on("$destroy", function() {
    if ($scope.inRoom) {
      $scope.leaveRoom($scope.currentRoom);
      $scope.$parent.hideFeedback();
    }
    chatSocket.disconnect();
    chatSocket.removeAllListeners();
    $(document).off("keyup", keyupHandler);
  });

  chatSocket.on('room data', function(data) {
    $scope.rooms = data.rooms;
    var rulesets = [];
    for (var i = 0; i < data.rooms.length; i++) {
      if (data.rooms[i].RulesetName) {
        //rulesets.push(require("./rulesets/" + data.rooms[i].RulesetName + ".js"));
      } else {
        rulesets.push({});
      }
    }
    $scope.rulesets = rulesets;
  });

  $scope.joinRoom = function(room) {
    var data = {
      Room: room,
      User: AuthService.currentUser()
    };
    chatSocket.emit('user joined', data);
    $scope.$parent.displayFeedback("Joining Room...");
  };

  chatSocket.on('join room finished', function(room) {
    $scope.currentRoom = room;
    $scope.inRoom = true;
    $scope.refreshMsgs();
    $scope.$parent.hideFeedback();
  });

  $scope.leaveRoom = function(room) {
    var currentUser = AuthService.currentUser();
    var data = {Room: room, User: currentUser};
    chatSocket.emit('user left', data);
    $scope.$parent.displayFeedback("Leaving Room...");
  };

  chatSocket.on('leave room finished', function() {
    $scope.currentRoom = {};
    $scope.msgs = [];
    $scope.post = {};
    dismissAllAlerts();
    $scope.inRoom = false;
    $scope.$parent.hideFeedback();
  });

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
    if (AuthService.isLoggedIn() && text) {
      var currentUser = AuthService.currentUser();
      var msg = {
        Author: {
          UserName: currentUser.UserName,
          DisplayName: currentUser.DisplayName
        },
        Content: text,
        Room: $scope.currentRoom
      };
      MsgFactory.create(msg).then(function() {
        chatSocket.emit("sent message", msg);
        $scope.post = {};
        $("#commentField").focus();
      }, function(err) {
        console.log("chat message error", err);
        $("#commentField").focus();
      });
    } else if (!AuthService.isLoggedIn()) {
      $scope.feedback['warning'] = "Your login has expired. Please log in.";
    }
  };

  chatSocket.on('new message', function(msg) {
    $scope.msgs.push(msg);
  });

  chatSocket.on('msg all', function(data) {
    console.log(data);
  });

  chatSocket.on('user joined', function(data) {
  });

  chatSocket.on('user left', function(data) {
  });

  chatSocket.on("move made", function(data) {
    console.log("move made", data);
  });

  //UI code
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
    return date.format('M/DD/YYYY h:mm:ss A');
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

  function keyupHandler(e) {
    if (e.keyCode == 27 && $scope.inRoom) {
      $scope.leaveRoom($scope.currentRoom);
    }
  }
};