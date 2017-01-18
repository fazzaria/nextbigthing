var angular = require('angular');

var UserCtrl = function() {
	angular.module('UserCtrl', []).controller('UserController', function($scope, User) {
    	$scope.UserName = '', $scope.DisplayName = "", $scope.Pwd = "", $scope.feedback = "";
    	$scope.addUser = function() {
			User.create({
				UserName: $scope.UserName,
				DisplayName: $scope.DisplayName,
				Pwd: $scope.Pwd,
			}).then(function(success) {
				var newUser = success.config.data;
				$scope.feedback = "Success! New user added with username " + newUser.UserName + ", display name " + newUser.DisplayName + ", and password " + newUser.Pwd + ".";
				$scope.UserName = "";
				$scope.DisplayName = "";
				$scope.Pwd = "";
			}, function(err) {
				$scope.feedback = err;
			});
    	};
        $scope.test = function() {
            User.get({}).then(function(success) {
                console.log(success);
                $scope.comments = success;
                $scope.feedback = "";
            }, function(err) {
                $scope.feedback = err;
            });
        };
	});
};

module.exports = UserCtrl;