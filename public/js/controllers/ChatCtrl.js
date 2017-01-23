var $ = require('jQuery');
module.exports = function($scope, AuthService, MsgFactory) {
    $scope.msgs = [], $scope.postText = "";
    $scope.refreshMsgs = function() {
        MsgFactory.get().then(function(success) {
            console.log(typeof(success.data[0].DatePosted));
            $scope.msgs = success.data;
            $scope.feedback = "";
        }, function(err) {
            $scope.feedback = err;
        });
    };
    $scope.postMsg = function() {
        var currentUser = AuthService.currentUser();
        if (currentUser) {
            MsgFactory.create({
                Content: $scope.postText,
                Author: currentUser.DisplayName
            }).then(function(success) {
                $scope.postText = "";
                $scope.feedback = "";
            }, function(err) {
                $scope.feedback = err;
            });
        } else {
            console.log("You are not signed in.");
        }
    };

    $("#commentField").on("keypress", function(e) {
        if (e.which == 13) {
            $scope.postMsg();
        }
    });
};