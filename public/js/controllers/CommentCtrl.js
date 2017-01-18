var $ = require('jquery');
var angular = require('angular');

var CommentCtrl = function(app) {
    angular.module('CommentCtrl', []).controller('CommentController', function($scope, Comment) {
        $scope.comments = [], $scope.Content = "", $scope.Author = "Test";
        $scope.loadComments = function() {
            Comment.get().then(function(success) {
                console.log(success);
                $scope.comments = success;
                $scope.feedback = "";
            }, function(err) {
                $scope.feedback = err;
            });
        };
        $scope.postComment = function() {
            Comment.create({
                Content: $scope.Content,
                Author: $scope.Author
            }).then(function(success) {
                $scope.Content = "";
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
    });
};

module.exports = CommentCtrl;