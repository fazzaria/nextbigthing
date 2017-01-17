var angular = require('angular');

var MainCtrl = function() {
	angular.module('MainCtrl', []).controller('MainController', function($scope) {
    	$scope.testtext = 'Test';
	});
};

module.exports = MainCtrl;