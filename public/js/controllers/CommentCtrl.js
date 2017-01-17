var $ = require('jquery');
var angular = require('angular');

var CommentCtrl = function(app) {
    angular.module('CommentCtrl', []).controller('CommentController', ['$scope', '$http', function($scope, $http) {
        $scope.comments = [], $scope.postText = "", $scope.userLoginField = "", $scope.userPwdField = "";

        $scope.tryLogin = function() {

        };

        function refreshComments(data) {
            $http.post("/getComments", data).then(
                function successCallback(response) {
                    $scope.comments = response.data;
                }, 
                function errorCallback(response) {
                    console.log(response);
                }
            );
        }

        $scope.loadComments = function() {
            var data = {
                test: "test1"
            };
            refreshComments(data);
        };

        $scope.postComment = function() {
            var data = {
                content: $scope.postText
            };
            if($scope.postText.length > 0) {
                $http.post("/postComment", data).then(
                    function successCallback(response) {
                        var data2 = [{ test: "test1" }];
                        refreshComments(data2);
                        $scope.postText = "";
                    }, 
                    function errorCallback(response) {
                        console.log(response);
                    }
                );
            }
        };

        $("#commentField").on("keypress", function(e) {
            if (e.which == 13) {
                $scope.postComment();
            }
        });
    }]);
};

module.exports = CommentCtrl;