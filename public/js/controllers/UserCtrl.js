var angular = require('angular');

var UserCtrl = function() {
	angular.module('UserCtrl', []).controller('UserController', function($scope) {
    	$scope.testtext = 'Test';
	});
};

module.exports = UserCtrl;