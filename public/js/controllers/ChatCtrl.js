var $ = require('jQuery');
module.exports = function($scope, AuthService, MsgFactory, chatSocket) {
    $scope.msgs = [], $scope.postText = "";

    $scope.refreshMsgs = function() {
        MsgFactory.get().then(function(success) {
            $scope.msgs = success.data;
            $scope.feedback = "";
        }, function(err) {
            $scope.feedback = err;
        });
    };

    $scope.postMsg = function() {
        var currentUser = AuthService.currentUser();
        if (currentUser) {
            var msg = {
                userid: currentUser._id,
                Content: $scope.postText
            }
            chatSocket.emit("new message", msg);
        } else {
            console.log("You are not signed in.");
        }
    };

    chatSocket.on('message created', function() {
        console.log("message created");
        $scope.refreshMsgs();
    })

    $("#commentField").on("keypress", function(e) {
        if (e.which == 13) {
            $scope.postMsg();
        }
    });
};