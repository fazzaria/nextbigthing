module.exports = function($scope, $location, AuthService) {
	$scope.loginInfo = {};
	$scope.currentUser = AuthService.currentUser();
	$scope.loggedIn = AuthService.isLoggedIn();
	$scope.tryLogin = function(loginInfo) {
		AuthService.login($scope.loginInfo).then(function() {
			$scope.loggedIn = AuthService.isLoggedIn();
			$scope.loginInfo = {};
		});
	};
	$scope.logout = function() {
		AuthService.logout();
		$scope.currentUser = AuthService.currentUser();
		$scope.loggedIn = AuthService.isLoggedIn();
		$location.url("/");
	};
	$scope.register = function() {
		$location.url("/register");
	};
};