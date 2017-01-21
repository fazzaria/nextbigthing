module.exports = function($scope, $location, AuthService) {
	$scope.loginUser = {};
	$scope.tryLogin = function() {
		AuthService.login($scope.loginUser);
	};
	$scope.logout = function() {
		//auto log out
		$scope.loggedIn = !$scope.loggedIn;
	};
	$scope.register = function() {
		$location.url("/register");
	};
};