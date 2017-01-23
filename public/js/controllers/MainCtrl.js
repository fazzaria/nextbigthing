module.exports = function($scope, $location, AuthService) {
	$scope.loginInfo = {};
	$scope.currentUser = AuthService.currentUser();
	$scope.loggedIn = AuthService.isLoggedIn();
	$scope.feedback = "";
	$scope.feedbackVisible = false;

	$scope.displayFeedback = function(feedback) {
		$scope.feedbackVisible = true;
		$scope.feedback = feedback;
	};

	$scope.hideFeedback = function(feedback) {
		$scope.feedbackVisible = false;
		$scope.feedback = "";
	};

	$scope.tryLogin = function(loginInfo) {
		$scope.displayFeedback("Signing in...");
		AuthService.login($scope.loginInfo).then(function() {
			$scope.loggedIn = AuthService.isLoggedIn();
			$scope.currentUser = AuthService.currentUser();
			$scope.loginInfo = {};
			$scope.hideFeedback();
		}, function() {
			$scope.hideFeedback();
		});
	};

	$scope.logout = function() {
		AuthService.logout();
		$scope.currentUser = AuthService.currentUser();
		$scope.loggedIn = AuthService.isLoggedIn();
		$location.url("/");
	};
	
	$scope.goRegister = function() {
		$location.url("/register");
	};
};