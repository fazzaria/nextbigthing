module.exports = function($scope, $location, AuthService) {
    $scope.registerUser = {};
    $scope.tryRegister = function() {
    	$scope.$parent.displayFeedback("Creating your account...");
        AuthService.register($scope.registerUser).then(function() {
        	$scope.$parent.hideFeedback();
    		$scope.$parent.displayFeedback("Account created! Signing you in...");
			AuthService.login($scope.registerUser).then(function() {
				$scope.$parent.loggedIn = AuthService.isLoggedIn();
				$scope.$parent.currentUser = AuthService.currentUser();
				$scope.registerUser = {};
				$location.url('/');
				$scope.hideFeedback();
			}, function() {
				$scope.hideFeedback();
			});
        }, function() {
        	$scope.$parent.hideFeedback();
        });
    };
};