var angular = require('angular');
//var angular = require('angular-route');

var appRoutes = function() {
    angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider
        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'MainController'
        })
        // users page that will use the UserController
        .when('/users', {
            templateUrl: 'views/user.html',
            controller: 'UserController'
        })
        // comments page that will use the CommentController
        .when('/comments', {
            templateUrl: 'views/comment.html',
            controller: 'CommentController'
        });

    $locationProvider.html5Mode(true);
    }]);
};

module.exports = appRoutes;