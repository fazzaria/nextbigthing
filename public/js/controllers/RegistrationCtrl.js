module.exports = function($scope, $location, AuthService) {
    $scope.registerUser = {};
    $scope.tryRegister = function() {
        AuthService.register($scope.registerUser).then(function() {
			$scope.$parent.tryLogin($scope.registerUser);
			$location.url('/');
        });
    };
};