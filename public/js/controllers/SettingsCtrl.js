module.exports = function($scope, UserFactory, AuthService) {
	$scope.user = AuthService.currentUser();
	$scope.deleteAccount = function() {
		UserFactory.delete(AuthService.currentUser()).then(function() {
			$scope.$parent.logout();
		});
	}
};