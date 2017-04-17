module.exports = function($scope, UserFactory, AuthService) {
	$scope.user = AuthService.currentUser();
	$scope.deleteAccount = function() {
		$scope.$parent.displayFeedback("Deleting account... :(");
		UserFactory.delete(AuthService.currentUser()._id).then(function() {
			$scope.hideFeedback();
			$scope.logout();
		});
	}
};