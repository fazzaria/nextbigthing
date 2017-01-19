var MainCtrl = function() {
	angular.module('MainCtrl', []).controller('MainController', function($scope, $location) {
    	$scope.tryLogin = function() {
    		//auto log in
    		$scope.loggedIn = !$scope.loggedIn;
    	};
    	$scope.logout = function() {
    		//auto log out
    		$scope.loggedIn = !$scope.loggedIn;
    	};
    	$scope.register = function() {
    		$location.url("/register");
    	};
	});
};

module.exports = MainCtrl;