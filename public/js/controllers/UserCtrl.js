module.exports = function($scope, UserFactory, AuthService) {
	$scope.UserName = '', $scope.DisplayName = "", $scope.Pwd = "", $scope.feedback = "";
	$scope.addUser = function() {
		UserFactory.create({
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
};