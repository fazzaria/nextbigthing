var $ = require('jQuery');
module.exports = function($scope, Comment) {
    $scope.comments = [], $scope.postText = "", $scope.Author = "Test";
    $scope.loadComments = function() {
        Comment.get().then(function(success) {
            console.log(success);
            $scope.comments = success.data;
            $scope.feedback = "";
        }, function(err) {
            $scope.feedback = err;
        });
    };
    $scope.postComment = function() {
        Comment.create({
            Content: $scope.postText,
            Author: $scope.Author
        }).then(function(success) {
            $scope.postText = "";
            $scope.feedback = "";
            $scope.loadComments();
        }, function(err) {
            $scope.feedback = err;
        });
    };

    $("#commentField").on("keypress", function(e) {
        if (e.which == 13) {
            $scope.postComment();
        }
    });
};